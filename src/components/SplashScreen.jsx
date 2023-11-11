import { View, Text, Image } from "react-native";
import React from "react";

const SplashScreen = () => {
  const global = require("@/utils/styles/global.js");

  return (
    <View style={[{ flex: 1 }, global.mainBgColor]}>
      <Image
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "contain",
        }}
        source={require("@/../assets/splash.png")}
      />
    </View>
  );
};

export default SplashScreen;
