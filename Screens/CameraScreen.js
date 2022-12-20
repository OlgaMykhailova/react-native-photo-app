import React, { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import uuid from "react-native-uuid";

import { getStorage, ref, uploadBytes } from "firebase/storage";

import DownloadPhoto from "../assets/images/downloadPhoto.svg";

export const CameraScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);

  const cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  const uploadPhotoToServer = async () => {
    try {
      const response = await fetch(photo);
      const uniquePostId = uuid.v4();
      const storage = getStorage();
      const storageRef = ref(storage, `postImage/${uniquePostId}`);
      await uploadBytes(storageRef, response.blob());
    } catch (error) {
      console.log("error-message.upoload-photo", error.message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
        }

        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setLocation(coords);
      } catch (error) {
        console.log("error-message", error.message);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        const mediaLibraryPermission =
          await MediaLibrary.requestPermissionsAsync();
        setHasCameraPermission(cameraPermission.status === "granted");
        setHasMediaLibraryPermission(
          mediaLibraryPermission.status === "granted"
        );
      } catch (error) {
        console.log("error-message", error.message);
      }
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return Alert.alert(
      "Permission for camera not granted. Please change this in settings."
    );
  }

  const takePic = async () => {
    try {
      const newPhoto = await cameraRef.current.takePictureAsync();
      setPhoto(newPhoto.uri);
    } catch (error) {
      console.log("error-message-take-pic", error.message);
    }
  };

  if (photo) {
    const sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    const savePic = () => {
      //save to phone's gallery
      //   MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
      //     setPhoto(undefined);
      //   });
      uploadPhotoToServer();
      navigation.navigate("Create Post", { photo, location });
      setTimeout(() => {
        setPhoto(undefined);
        setLocation(null);
      }, 400);
    };

    return (
      <View style={styles.container}>
        <Image style={styles.preview} source={{ uri: photo }} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={{ ...styles.button, marginRight: 8 }}
            onPress={sharePic}
          >
            <Text style={styles.textButton}>Share photo</Text>
          </TouchableOpacity>
          {hasMediaLibraryPermission ? (
            <TouchableOpacity
              style={{ ...styles.button, marginRight: 8 }}
              onPress={savePic}
            >
              <Text style={styles.textButton}>Save</Text>
            </TouchableOpacity>
          ) : undefined}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setPhoto(undefined)}
          >
            <Text style={styles.textButton}>Discard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera ref={cameraRef} style={styles.camera}>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
          }}
          onPress={takePic}
        >
          <DownloadPhoto />
        </TouchableOpacity>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  takeButton: {
    marginBottom: 32,
    width: 150,
    height: 45,
    padding: 12,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
  },
  button: {
    width: 100,
    height: 45,
    padding: 12,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 83,
    backgroundColor: "000",
  },

  textButton: {
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#FFFFFF",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
