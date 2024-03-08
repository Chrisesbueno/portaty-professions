import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useEffect } from "react";

const StepLoading = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Unprofile");
    }, 2000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator color={`#1f1f1f`} size={`large`}></ActivityIndicator>
    </View>
  );
};

export default StepLoading;
