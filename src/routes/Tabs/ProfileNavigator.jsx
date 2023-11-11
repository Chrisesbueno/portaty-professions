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
        name="Form"
        component={Form}
        options={{
          animation: "slide_from_right",
          header: (props) => <LeftHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="Page"
        component={Page}
        options={{
          animation: "slide_from_right",
          header: (props) => <LeftHeader {...props} />,
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
