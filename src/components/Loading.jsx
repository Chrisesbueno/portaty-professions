import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const Loading = () => {
  const global = require("@/utils/styles/global.js");
  return (
    <View
      style={[
        { flex: 1, alignItems: "center", justifyContent: "center" },
        global.bgWhite,
      ]}
    >
      <ActivityIndicator size="large" color="#fb8500" />
    </View>
  );
};

export default Loading;
