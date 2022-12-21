import React, { useState, useEffect, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  FlatList,
} from "react-native";

import { collection, query, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/config";

import Message from "../assets/images/message.svg";
import Like from "../assets/images/like.svg";
import Location from "../assets/images/location.svg";

export const PostsScreen = ({ route, navigation }) => {
  const [fontsLoaded] = useFonts({
    Roboto: require("../assets/fonts/Roboto-Regular.ttf"),
    RobotoMedium: require("../assets/fonts/Roboto-Medium.ttf"),
    RobotoBold: require("../assets/fonts/Roboto-Bold.ttf"),
  });

  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  const [posts, setPosts] = useState([]);

  const getAllPosts = async () => {
    try {
      const ref = query(collection(firestore, "posts"));
      onSnapshot(ref, (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    } catch (error) {
      console.log("error-message.get-posts", error.message);
    }
  };

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;
      setWindowWidth(width);
    };
    const dimensionsHandler = Dimensions.addEventListener("change", onChange);

    return () => dimensionsHandler.remove();
  }, []);

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      onLayout={onLayout}
      style={{ backgroundColor: "#FFFFFF", alignItems: "center" }}
    >
      <FlatList
        ListHeaderComponent={
          <View style={{ ...styles.userSection, width: windowWidth - 16 * 2 }}>
            <Image
              style={styles.avatarImage}
              source={require("../assets/images/userAvatar.jpg")}
            />
            <View style={styles.userInfo}>
              <Text
                style={{ ...styles.textUserName, fontFamily: "RobotoBold" }}
              >
                Natali Romanova
              </Text>
              <Text style={{ ...styles.textUserEmail, fontFamily: "Roboto" }}>
                email@example.com
              </Text>
            </View>
          </View>
        }
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{ ...styles.cardContainer, width: windowWidth - 16 * 2 }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={{ uri: item.photo }}
                style={{
                  ...styles.cardImage,
                  width: windowWidth - 16 * 2,
                }}
              />
            </View>
            <Text style={{ ...styles.cardTitle, fontFamily: "RobotoMedium" }}>
              {item.title}
            </Text>
            <View style={styles.cardThumb}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={styles.wrapper}
                  onPress={() => navigation.navigate("Comments")}
                >
                  <Message />
                  <Text style={styles.cardText}>{item.comments}</Text>
                </TouchableOpacity>
                <View style={{ ...styles.wrapper, marginLeft: 24 }}>
                  <Like />
                  <Text style={styles.cardText}>{item.likes}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.wrapper}
                onPress={() => navigation.navigate("Map")}
              >
                <Location />
                <Text style={styles.cardText}>location</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  userSection: {
    marginVertical: 32,
    flexDirec     tion: "row",
    alignItems: "center",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    resizeMode: "cover",
  },
  userInfo: {
    marginLeft: 8,
  },
  textUserName: {
    color: "#212121",
    fontSize: 13,
    lineHeight: 15,
  },
  textUserEmail: {
    color: "#212121",
    opacity: 0.8,
    fontSize: 11,
    lineHeight: 13,
  },
  cardSection: {
    alignItems: "center",
    width: "100%",
    marginTop: 32,
  },
  cardContainer: {},
  cardImage: {
    height: 240,
    resizeMode: "cover",
    borderRadius: 8,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
  cardThumb: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 35,
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    marginLeft: 4,
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
});
