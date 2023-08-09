import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React from "react";
import styles from "@/utils/styles/Header.module.css";

const SearchHeader = () => {
  const global = require("@/utils/styles/global.js");
  return (
    <View style={[styles.home, global.bgWhite]}>
      <TouchableOpacity
        style={[styles.content, global.bgWhiteSoft]}
        activeOpacity={1}
      >
        <Image
          style={{
            width: 30,
            height: 30,
            resizeMode: "cover",
          }}
          source={require("@/utils/images/search.png")}
        />
        <TextInput placeholder={"Buscar"} style={styles.input} />
      </TouchableOpacity>
      <View style={[styles.lineSearch, global.mainBgColor]} />
    </View>
  );
};

export default SearchHeader;
