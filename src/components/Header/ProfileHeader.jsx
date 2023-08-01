import { View, Text, Image } from "react-native";
import React from "react";
import styles from "@/assets/styles/Header.module.css";

const ProfileHeader = () => {
  const global = require("@/assets/styles/global.js");
  return (
    <View style={[styles.home, global.bgWhite]}>
      <View style={{
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Text style={[{ fontFamily: "name", fontSize: 26 }, global.mainColor]}>
          Portaty
        </Text>
        <Image
          style={{
            width: 45,
            height: 45,
            resizeMode: "cover",
          }}
          source={require("@/assets/images/gear.png")}
        />
      </View>
    </View>
  );
};

export default ProfileHeader;