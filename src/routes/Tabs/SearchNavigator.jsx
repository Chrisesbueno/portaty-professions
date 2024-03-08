import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "@/screens/Search/Search";
import SearchHeader from "@/components/Header/SearchHeader";
import SearchPost from "@/screens/Search/SearchPost";
import SearchIn from "@/screens/Search/SearchIn";
import styles from "@/utils/styles/Header.module.css";
import SearchOut from "@/screens/Search/SearchOut";
import LeftHeader from "@/components/Header/LeftHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Other from "@/screens/Search/Other";
import CustomQR from "@/components/CustomQR";
import { useRecoilState } from "recoil";
import { activeSearch, textInputSearch } from "@/atoms";

const SearchNavigator = ({ navigation }) => {
  const [active, setActive] = useState(false);
  const [activeOut, setActiveOut] = useRecoilState(activeSearch);
  const [inputSearch, setInputSearch] = useRecoilState(textInputSearch);
  const Stack = createNativeStackNavigator();
  const global = require("@/utils/styles/global.js");
  // Guardar los resultados de la búsqueda
  const cacheResults = async (resultado) => {
    try {
      const terminosGuardados = JSON.parse(await AsyncStorage.getItem('@terminos_busqueda')) || [];
      terminosGuardados.push(resultado);
      await AsyncStorage.setItem('@terminos_busqueda', JSON.stringify(terminosGuardados));
    } catch (error) {
      console.log('error aqui' , error)
    }
  };
  return (
    <Stack.Navigator initialRouteName={`Search`}>
      <Stack.Screen
        name="Search"
        component={active ? SearchIn : Search}
        options={{
          header: (props) => (
            <View style={[styles.home, global.bgWhite]}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: active ? 40 : 0,
                }}
              >
                {active && (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setActive(false)}
                  >
                    <Image
                      style={{
                        width: 40,
                        height: 30,
                        resizeMode: "cover",
                      }}
                      source={require("@/utils/images/arrow_back.png")}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.content, global.bgWhite]}
                  activeOpacity={1}
                  onPress={() => setActive(true)}
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
                    placeholder={"Buscar"}
                    style={styles.input}
                    onPressIn={() => setActive(true)}
                    onChangeText={(e) => setInputSearch(e)}
                    placeholderTextColor='#1f1f1f'
                    value={inputSearch}
                    returnKeyType="search"
                    onSubmitEditing={() => {
                      setActiveOut(false);
                      cacheResults(inputSearch.trim());
                      navigation.navigate("SearchOut", { input: inputSearch });
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.lineSearch, global.mainBgColor]} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="SearchOut"
        component={activeOut ? SearchIn : SearchOut}
        options={{
          animation: "slide_from_right",
          header: (props) => (
            <View style={[styles.home, global.bgWhite]}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: 40,
                }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    navigation.navigate("Search");
                    setActive(false);
                  }}
                >
                  <Image
                    style={{
                      width: 40,
                      height: 30,
                      resizeMode: "cover",
                    }}
                    source={require("@/utils/images/arrow_back.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.content, global.bgWhite]}
                  activeOpacity={1}
                  onPress={() => setActiveOut(true)}
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
                    placeholder={"Buscar"}
                    style={styles.input}
                    onPressIn={() => setActiveOut(true)}
                    onChangeText={(e) => setInputSearch(e)}
                    value={inputSearch}
                    placeholderTextColor='#1f1f1f'
                    returnKeyType="search"
                    onSubmitEditing={() => {
                      setActiveOut(false);
                      cacheResults(inputSearch.trim());
                      navigation.navigate("SearchOut", { input: inputSearch });
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.lineSearch, global.mainBgColor]} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="SearchPost"
        component={SearchPost}
        options={{
          animation: "slide_from_right",
          header: (props) => <LeftHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="Other"
        component={Other}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="ViewQR"
        component={CustomQR}
        options={{
          animation: "slide_from_right",
          header: (props) => <LeftHeader {...props} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
