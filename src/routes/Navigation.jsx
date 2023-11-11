import "react-native-gesture-handler";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginNavigator from "./Authentication/LoginNavigator";
import Tabs from "./Tabs/Tabs";
// Navigation Settings
import NavSettings from "./NavSettings";
// recoil
import { useRecoilValue, useRecoilState } from "recoil";
import { userAuthenticated, mapUser } from "@/atoms";
// linking
import SharePage from "@/screens/Search/SharePage";
import linking from "./linking";
import LeftHeaderShare from "@/components/Header/LeftHeaderShare";
// hooks
import useLocation from "@/hooks/useLocation";
import ShareNavigator from "./ShareNavigator";
import SplashScreen from "@/components/SplashScreen";
import { Text, View, Image } from "react-native";
import Loading from "@/components/Loading";

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  const global = require("@/utils/styles/global.js");
  const [checkRender, setCheckRender] = useState(true);
  const [userState, setUserState] = useState(false);
  const [isFirsTime, setIsFirsTime] = useState(false);
  const userAuth = useRecoilValue(userAuthenticated);
  // pido localizacion
  const { location } = useLocation();
  const renderNavigation = () => {
    setCheckRender(true);

    try {
      if (userAuth !== null) setUserState(true);
      setTimeout(() => {
        setCheckRender(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setCheckRender(false);
      }, 2000);
    }
    setIsFirsTime(true);
  };

  useEffect(() => {
    if (!isFirsTime) renderNavigation();
  }, [userAuth]);

  return (
    <NavigationContainer fallback={<Loading />}>
      <NavSettings checkRender={checkRender} />
      {checkRender === false ? (
        <Stack.Navigator>
          {userAuth ? (
            <Stack.Screen
              name={`Tabs_Navigation`}
              component={Tabs}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <Stack.Screen
              name={`Login_Welcome`}
              component={LoginNavigator}
              options={{
                headerShown: false,
              }}
            />
          )}
          <Stack.Screen
            name="SharePage"
            component={SharePage}
            options={{
              animation: "slide_from_right",
              header: (props) => <LeftHeaderShare {...props} />,
            }}
          />
          <Stack.Screen
            name="ShareNavigator"
            component={ShareNavigator}
            options={{
              animation: "slide_from_right",
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Loading">
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
