import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import styles from "@/utils/styles/Header.module.css";

const LeftHeader = ({navigation}) => {
  const global = require("@/utils/styles/global.js");
  return (
    <View style={[styles.left, global.bgWhite]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Image
            style={{
              width: 45,
              height: 45,
              resizeMode: "contain",
            }}
            source={require("@/utils/images/arrow_back.png")}
          />
        </TouchableOpacity>
    </View>
  );
};

export default LeftHeader;
