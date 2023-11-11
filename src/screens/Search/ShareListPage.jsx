import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "@/utils/styles/ShareListPage.module.css";
import ItemShareList from "@/components/ItemShareList";
import * as customSearch from "@/graphql/CustomQueries/Search";
import { Auth, API, Storage } from "aws-amplify";
import * as queries from "@/graphql/CustomQueries/Favorites";
import * as customFavorites from "@/graphql/CustomMutations/Favorites";
import CustomButton from "@/components/CustomButton";

const ShareListPage = ({ route, navigation }) => {
  const { params } = route;
  const global = require("@/utils/styles/global.js");
  const [data, setData] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [error, setError] = useState(false);
  const [nothing, setNothing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const result = await API.graphql({
        query: queries.getUsers,
        authMode: "AWS_IAM",
        variables: {
          id: params?.id,
        },
      });
      console.log(result.data.getUsers.favorites.items);
      setFavoritesList(result.data.getUsers.favorites.items);
      if (result.data.getUsers.favorites.items.length === 0) setNothing(true);
      setError(false);
    } catch (error) {
      console.log("OCURRIO UN ERROR");
      setError(true);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (params?.id !== undefined) fetchFavorites();
  }, [params]);

  if (loading)
    return (
      <View
        style={[
          { flex: 1, alignItems: "center", justifyContent: "center" },
          global.bgWhite,
        ]}
      >
        <ActivityIndicator size="large" color="#fb8500" />
      </View>
    );

  if (favoritesList.length === 0 || params?.id === undefined || error)
    return (
      <View
        style={[
          { flex: 1, alignItems: "center", justifyContent: "center" },
          global.bgWhite,
        ]}
      >
        <Text style={{ fontFamily: "light", fontSize: 16 }}>
          Este usuario no tiene ningun negocio en favoritos para compartir
        </Text>
        <CustomButton
          text={`Encuentra mas negocios`}
          handlePress={() => navigation.navigate("Tabs_Navigation")}
          textStyles={[styles.textSearch, global.white]}
          buttonStyles={[styles.search, global.mainBgColor]}
        />
      </View>
    );

  if (favoritesList.length !== 0)
    return (
      <ScrollView style={[{ flex: 1, padding: 20 }, global.bgWhite]}>
        <Text
          style={{ fontSize: 16, fontFamily: "light", paddingVertical: 20 }}
        >
          Compartieron esta lista de negocios contigo
        </Text>
        <View style={{}}>
          {favoritesList.map((post, index) => (
            <ItemShareList
              key={index}
              data={post}
              styled={{ column: styles.columnList }}
            />
          ))}
        </View>
      </ScrollView>
    );
};

export default ShareListPage;
