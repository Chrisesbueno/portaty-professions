import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import styles from "@/utils/styles/Header.module.css";
import { useRecoilState } from "recoil";
import { inputFavoritesSearch } from "@/atoms";

const HomeHeader = () => {
  const global = require("@/utils/styles/global.js");
  const [inputSearch, setInputSearch] = useState("");
  const [inputFavorites, setInputFavorites] = useRecoilState(inputFavoritesSearch);
  const handleKeyPress = (input) => {
    setInputFavorites(input.trim())
  }
  return (
    <View style={[styles.home, global.bgWhite]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* <Text style={[{ fontFamily: "name", fontSize: 26 }, global.mainColor]}>
          Portaty
        </Text> */}
        <Image
          style={{
            width: 80,
            height: 50,
            resizeMode: "cover",
            marginLeft: -12,
          }}
          source={require("@/utils/images/portaty.png")}
        />
        {/* <Image
          style={{
            width: 50,
            height: 50,
            resizeMode: "cover",
          }}
          source={require("@/utils/images/profile_default.png")}
        /> */}
      </View>

      <TouchableOpacity
        style={[styles.content, global.bgWhite]}
        activeOpacity={1}
      >
        <Image
          style={{
            width: 22,
            height: 22,
            resizeMode: "cover",
          }}
          source={require("@/utils/images/search_white.png")}
        />
        <TextInput
          placeholder={"Buscar favoritos"}
          defaultValue={inputFavorites}
          style={styles.input}
          placeholderTextColor='#1f1f1f'
          returnKeyType="search"
          onChangeText={(e) => setInputSearch(e)}
          onSubmitEditing={() => handleKeyPress(inputSearch)}
        />
      </TouchableOpacity>
      <View style={[styles.line, global.mainBgColor]} />
    </View>
  );
};

export default HomeHeader;
