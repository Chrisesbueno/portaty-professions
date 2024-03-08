import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeftHeader from "@/components/Header/LeftHeader";
import LeftHeaderShare from "@/components/Header/LeftHeaderShare";
import SharePage from "@/screens/Search/SharePage";
import ShareListPage from "@/screens/Search/ShareListPage";
import CustomQR from "@/components/CustomQR";

const ShareNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName={`SharePage`}>
      <Stack.Screen
          name="ShareListPage"
          component={ShareListPage}
          options={{
            animation: "slide_from_right",
            header: (props) => <LeftHeaderShare {...props} />,
          }}
        />
        <Stack.Screen
          name="SharePage"
          component={SharePage}
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

export default ShareNavigator;
