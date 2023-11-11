import { View, Text, Image } from "react-native";
import React from "react";
import styles from "@/utils/styles/Header.module.css";

const ProfileHeader = () => {
  const global = require("@/utils/styles/global.js");
  return (
    <View style={[styles.home, global.bgWhite]}>
      <View style={{
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Image
          style={{
            width: 80,
            height: 50,
            resizeMode: "cover",
            marginLeft: -12
          }}
          source={require("@/utils/images/portaty.png")}
        />
        {/* <Image
          style={{
            width: 45,
            height: 45,
            resizeMode: "cover",
          }}
          source={require("@/utils/images/gear.png")}
        /> */}
      </View>
    </View>
  );
};

export default ProfileHeader;
