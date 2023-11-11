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

import Other from "@/screens/Search/Other";
import CustomQR from "@/components/CustomQR";

const SearchNavigator = ({ navigation }) => {
  const [active, setActive] = useState(false);
  const [activeOut, setActiveOut] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const Stack = createNativeStackNavigator();
  const global = require("@/utils/styles/global.js");
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
                  style={[styles.content, global.bgWhiteSoft]}
                  activeOpacity={1}
                  onPress={() => setActive(true)}
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
                    onPressIn={() => setActive(true)}
                    onChangeText={(e) => setInputSearch(e)}
                    value={inputSearch}
                    returnKeyType="search"
                    onSubmitEditing={() => {
                      setActiveOut(false);
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
                  style={[styles.content, global.bgWhiteSoft]}
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
                    returnKeyType="search"
                    onSubmitEditing={() => {
                      setActiveOut(false);
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
