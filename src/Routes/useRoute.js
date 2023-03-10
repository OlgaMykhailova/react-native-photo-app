import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Home } from "../Screens/Home";
import { RegistrationScreen } from "../Screens/RegistrationScreen";
import { LoginScreen } from "../Screens/LoginScreen";
import {CreatePostsScreen} from '../Screens/CreatePostsScreen';
import { CommentsScreen } from "../Screens/CommentsScreen";
import { MapScreen } from "../Screens/MapScreen";
import { CameraScreen } from "../Screens/CameraScreen";

const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

export const useRoute = (isLogin) => {
  return isLogin ? (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      ></MainStack.Screen>
      <MainStack.Screen
        options={{
          headerShown: true,
          headerTitleStyle: { color: "#212121", fontSize: 17 },
          headerTitleAlign: "center",
        }}
        name="Comments"
        component={CommentsScreen}
      ></MainStack.Screen>
      <MainStack.Screen
        options={{ headerShown: true }}
        name="Create Post"
        component={CreatePostsScreen}
      ></MainStack.Screen>
      <MainStack.Screen
        options={{ headerShown: true }}
        name="Camera"
        component={CameraScreen}
      ></MainStack.Screen>
      <MainStack.Screen
        options={{ headerShown: true }}
        name="Map"
        component={MapScreen}
      ></MainStack.Screen>
    </MainStack.Navigator>
  ) : (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Registration"
        component={RegistrationScreen}
      ></AuthStack.Screen>
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginScreen}
      ></AuthStack.Screen>
    </AuthStack.Navigator>
  );
};
