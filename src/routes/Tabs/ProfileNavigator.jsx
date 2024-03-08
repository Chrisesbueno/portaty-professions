import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeftHeader from "@/components/Header/LeftHeader";
import ProfileHeader from "@/components/Header/ProfileHeader";
import Profile from "@/screens/Profile/Profile";
import Post from "@/screens/Profile/Post";
import Form from "@/screens/Profile/Form";
import Unprofile from "@/screens/Profile/Unprofile";
import Introduction from "@/screens/Profile/Introduction";
import Terms from "@/screens/Profile/Terms";
import About from "@/screens/Profile/About";
import List from "@/screens/Profile/List";
import Page from "@/screens/Profile/Page";
import CustomQR from "@/components/CustomQR";
import FormNavigator from "../FormNavigation";
import MapScreen from "@/screens/Profile/Page/Map";
import PageNavigator from "../PageNavigator";

const ProfileNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName={`Unprofile`}>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ header: (props) => <LeftHeader {...props} /> }}
      />
      <Stack.Screen
        name="Unprofile"
        component={Unprofile}
        options={{ header: (props) => <ProfileHeader {...props} /> }}
      />
      <Stack.Screen
        name="FormNavigator"
        component={FormNavigator}
        options={{
          animation: "slide_from_right",
          headerShown: false,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name="MapView"
        component={MapScreen}
        options={{
          // animation: "slide_from_right",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PageNavigator"
        component={PageNavigator}
        options={{
          animation: "slide_from_right",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="List"
        component={List}
        options={{
          animation: "slide_from_right",
          header: (props) => <LeftHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="Introduction"
        component={Introduction}
        options={{
          animation: "slide_from_right",
          header: (props) => <LeftHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{
          animation: "slide_from_right",
          header: (props) => <LeftHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          animation: "slide_from_right",
          header: (props) => <LeftHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="Post"
        component={Post}
        options={{
          animation: "slide_from_right",
          header: (props) => <LeftHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="ViewQR"
        component={CustomQR}
        options={{
          animation: "slide_from_right",
          header: (props) => <LeftHeader {...props} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
