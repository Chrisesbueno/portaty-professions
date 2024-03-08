import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { favoriteSelection, favoritesState, inputFavoritesSearch } from "@/atoms";
import { Auth, API, Storage } from "aws-amplify";
import * as queries from "@/graphql/CustomQueries/Favorites";
import * as customFavorites from "@/graphql/CustomMutations/Favorites";
import styles from "@/utils/styles/Header.module.css";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";

const FavoriteHeader = ({ multiple = false }) => {
  const global = require("@/utils/styles/global.js");
  const [selection, setSelection] = useRecoilState(favoriteSelection);
  const [statusFavorite, setStatusFavorite] = useRecoilState(favoritesState);
  const [favoritesList, setFavoritesList] = useState([]);
  const isThere = favoritesList.some((obj) => obj.id === selection[0] && obj.position > 0)
  const [inputFavorites, setInputFavorites] =
  useRecoilState(inputFavoritesSearch);

  const fetchFavorites = async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();
    const result = await API.graphql({
      query: queries.userByEmailPosition,
      authMode: "AMAZON_COGNITO_USER_POOLS",
      variables: {
        email: attributes.email,
      },
    });
    setFavoritesList(result.data.userByEmail.items[0].favorites.items);
  };
  function handleKeyPress() {
  }
  const onDeleteFavorite = async () => {
    try {
      const deleteFavorite = await API.graphql({
        query: customFavorites.deleteFavorites,
        variables: {
          input: {
            id: selection[0],
          },
        },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      setInputFavorites("")
    } catch (error) {
      console.log(error);
    }
  };
  const onAnchorFavorite = async () => {

    let newPosition = 1;
    
    while (favoritesList.some((obj) => obj.position === newPosition)) {
      newPosition += 1;
    }
    try {
    if (isThere) {
      const updateFavoritesTrue = await API.graphql({
        query: customFavorites.updateFavorites,
        variables: {
          input: {
            id: selection[0],
            position: 0
          },
        },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      setInputFavorites("")
    } else {
      const updateFavoritesFalse = await API.graphql({
        query: customFavorites.updateFavorites,
        variables: {
          input: {
            id: selection[0],
            position: newPosition
          },
        },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
    }

    } catch (error) {
      console.log(error);
    }
  };
  const onMultipleDeleteFavorites = async () => {
    selection.map(async (item, index) => {
      try {
        const deleteFavorite = await API.graphql({
          query: customFavorites.deleteFavorites,
          variables: {
            input: {
              id: item,
            },
          },
          authMode: "AMAZON_COGNITO_USER_POOLS",
        });
        setInputFavorites("")
      } catch (error) {
        console.log(error);
      }
    });
  };
  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <View style={[global.bgWhite, { padding: 20 }]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => setSelection([])}>
          <Image
            style={{
              width: 45,
              height: 45,
              resizeMode: "contain",
            }}
            source={require("@/utils/images/arrow_back.png")}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {selection.length === 1 && (
            <TouchableOpacity onPress={() => {
              onAnchorFavorite()
              setSelection([]);
              setStatusFavorite(!statusFavorite);
            }}>
             {isThere ? <EvilIcons name="lock" size={42} color="#1f1f1f" /> : <EvilIcons name="unlock" size={42} color="#1f1f1f" /> }
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              if (selection.length === 1) {
                onDeleteFavorite();
              } else {
                onMultipleDeleteFavorites();
              }
              setStatusFavorite(!statusFavorite);
              setSelection([]);
            }}
          >
            <EvilIcons name="trash" size={42} color="#1f1f1f" />
          </TouchableOpacity>
        </View>
      </View>
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
        <TextInput
          placeholder={"Buscar"}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={() => handleKeyPress()}
        />
      </TouchableOpacity>
      <View style={[styles.line, global.mainBgColor]} />
    </View>
  );
};

export default FavoriteHeader;
