import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeHeader from "@/components/Header/HomeHeader";
import Home from "@/screens/Home/Home";
import FavoritePage from "@/screens/Home/FavoritePage";
import LeftHeader from "@/components/Header/LeftHeader";
import { useRecoilValue } from "recoil";
import { favoriteSelection } from "@/atoms";
import FavoriteHeader from "@/components/Header/FavoriteHeader";
import CustomQR from "@/components/CustomQR";


const HomeNavigator = ({ route, navigation }) => {
  const Stack = createNativeStackNavigator();
  const selections = useRecoilValue(favoriteSelection);
  return (
    <Stack.Navigator id="Home_Stack" initialRouteName={`Home`}>
      <Stack.Screen
        name="Home"
        options={{
          header: (props) =>
            selections.length === 0 ? (
              <HomeHeader {...props} />
            ) : (
              <FavoriteHeader
                {...props}
                multiple={selections.length === 1 ? false : true}
              />
            ),
        }}
      >
        {(props) => <Home {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="FavoritePage"
        component={FavoritePage}
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

export default HomeNavigator;
