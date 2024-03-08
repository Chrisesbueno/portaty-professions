import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { activeSearch, textInputSearch } from "@/atoms";
const SearchIn = () => {
  const global = require("@/utils/styles/global.js");
  const [results, setResults] = useState([]);
  const navigation = useNavigation()
  const [activeOut, setActiveOut] = useRecoilState(activeSearch);
  const [inputSearch, setInputSearch] = useRecoilState(textInputSearch);
  const cacheResults = async () => {
    try {
      const value = await AsyncStorage.getItem("@terminos_busqueda");
      if (value !== null) {
        setResults(JSON.parse(value));
        return JSON.parse(value);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteCacheResult = async (termino) => {
    try {
      const terminosGuardados =
        JSON.parse(await AsyncStorage.getItem("@terminos_busqueda")) || [];
      const nuevosTerminos = terminosGuardados.filter((t) => t !== termino);
      await AsyncStorage.setItem(
        "@terminos_busqueda",
        JSON.stringify(nuevosTerminos)
      );
      setResults(nuevosTerminos)
    } catch (error) {
      // Guardar error
    }
  };
  useEffect(() => {
    cacheResults();
  }, []);

  return (
    <View
      style={[
        { flex: 1, paddingHorizontal: 20, paddingTop: 5 },
        global.bgWhite,
      ]}
    >
      <Text
        style={[
          {
            fontFamily: "bold",
            fontSize: 18,
            letterSpacing: -1,
            marginBottom: 10,
          },
          global.black,
        ]}
      >
        Recientes
      </Text>

      {results.map((item, index) => (
        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
          key={index}
        >
          <TouchableOpacity
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
            onPress={() => {
              setInputSearch(item)
              setActiveOut(false)
              navigation.navigate("SearchOut", { input: item });
            }}
          >
            <Image
              style={{
                width: 35,
                height: 35,
                resizeMode: "cover",
                marginRight: 5,
              }}
              source={require("@/utils/images/search.png")}
            />
            <Text
              style={[{ fontFamily: "regular", fontSize: 16 }, global.black]}
            >
              {item}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteCacheResult(item)}>
            <Text
              style={[{ fontFamily: "light", fontSize: 16 }, global.black]}
            >
              X
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default SearchIn;
