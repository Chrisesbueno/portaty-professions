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
    console.log(input)
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

      {/* <TouchableOpacity
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
        <TextInput
          placeholder={"Buscar Favoritos"}
          defaultValue={inputFavorites}
          style={styles.input}
          returnKeyType="search"
          onChangeText={(e) => setInputSearch(e)}
          onSubmitEditing={() => handleKeyPress(inputSearch)}
        />
      </TouchableOpacity> */}
      <View style={[styles.line, global.mainBgColor]} />
    </View>
  );
};

export default HomeHeader;
