import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import GridSearch from "@/components/Search/GridSearch";
import * as customSearch from "@/graphql/CustomQueries/Search";
import { Auth, API, Storage } from "aws-amplify";
import Slider from "@react-native-community/slider";
import styles from "@/utils/styles/Tags.module.css";
import {
  mapUser,
  searchStatus,
  searchCache,
  kmRadio,
  totalSearch,
} from "@/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import * as Location from "expo-location";
import * as queries from "@/graphql/CustomQueries/Favorites";
import useLocation from "@/hooks/useLocation";
const Search = ({ route }) => {
  const global = require("@/utils/styles/global.js");
  const [moreItems, setMoreItems] = useState(1);
  const [items, setItems] = useState([]);
  const [searchActive, setSearchActive] = useRecoilState(searchStatus);
  const [searchCacheActive, setSearchCacheActive] = useRecoilState(searchCache);
  const [totalData, setTotalData] = useRecoilState(totalSearch);
  const [totalLimit, setTotalLimit] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState(false);
  const [filterRadio, setFilterRadio] = useRecoilState(kmRadio);
  const { location } = useLocation();
  const kilometers = [1, 5, 10, 20, 50, 100];
  let number = 26 * moreItems;
  const getData = async () => {
    const api = "api-professions-gateway";
    const path = "/searchBusinessByDistance";
    const params = {
      headers: {},
      queryStringParameters: {
        location: JSON.stringify({
          lat: location?.latitude,
          lon: location?.longitude,
        }),
        km: filterRadio,
        from: 0,
        limit: number,
      },
    };
    try {
      const response = await API.get(api, path, params);
      setTotalData(response.total);
      setTotalLimit(response.limit);
      // let newItems = [];
      let newRenderItems = [];
      const long = 26;
      for (let i = 0; i < response.items.length; i += long) {
        let cut = response.items.slice(i, i + long);
        newRenderItems.push(cut);
      }
      setSearchActive(true);
      setSearchCacheActive(newRenderItems);
      return setItems(newRenderItems);
    } catch (error) {
      return console.log(error);
    }
  };
  const getFilterData = async () => {
    setStatusFilter(true);
    getData();
    // setTimeout(() => {}, 3000);
    setStatusFilter(false);
  };
  useEffect(() => {
    // espero que me traiga algo de location
    if (location) getData();
  }, [location, moreItems]);

  if (searchActive) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF", paddingBottom: 50 }}>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
              paddingHorizontal: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "light",
              }}
            >
              Tienes {totalData} negocios cerca de ti
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                }}
                source={require("@/utils/images/editcard.png")}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "thinItalic",
                }}
              >
                Filtrar
              </Text>
            </View>
          </View>

          <Modal animationType="none" transparent={true} visible={modalVisible}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalTop}>
                  <Pressable
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: "contain",
                      }}
                      source={require("@/utils/images/arrow_back.png")}
                    />
                  </Pressable>
                  <Text style={styles.modalText}>{`Filtra tu busqueda`}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={styles.modalText}
                  >{`La distancia de tu radio son: ${filterRadio} km`}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      marginVertical: 15,
                    }}
                  >
                    {kilometers.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setFilterRadio(item)}
                        style={[
                          filterRadio === item
                            ? global.mainBgColor
                            : global.bgWhite,
                          {
                            padding: 7,
                            borderRadius: 4,
                            marginBottom: 7,
                            borderWidth: 0.5,
                            borderColor: filterRadio === item ? "#fff" : "#000",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            { fontFamily: "regular", fontSize: 12 },
                            filterRadio === item ? global.white : global.black,
                          ]}
                        >
                          {item}km
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text
                    style={styles.modalText}
                  >{`La distancia esta reflejada en un radio de kilometros`}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={[
                      global.mainBgColor,
                      {
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 49,
                        marginTop: 80,
                      },
                    ]}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      if (location) getFilterData();
                    }}
                  >
                    <Text
                      style={[
                        global.white,
                        { fontFamily: "medium", fontSize: 14 },
                      ]}
                    >
                      {`Buscar`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </TouchableOpacity>
        {statusFilter ? (
          <View
            style={[
              { flex: 1, alignItems: "center", justifyContent: "center" },
              global.bgWhite,
            ]}
          >
            <ActivityIndicator size="large" color="#fb8500" />
          </View>
        ) : searchActive ? (
          <FlatList
            data={searchCacheActive}
            renderItem={({ item, index }) => (
              <GridSearch renderItems={item} more={index} />
            )}
            keyExtractor={(item, index) => index}
            ListFooterComponent={() => (
              <View
                style={{
                  height: 100,
                  background: "#ffffff",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: 20,
                }}
              >
                {/* {totalData > totalLimit && (
                <ActivityIndicator size="large" color="#5E2129" />
              )} */}
                {totalData === totalLimit && (
                  <Text style={{ fontFamily: "light", fontSize: 14 }}>
                    No hay mas negocios por mostrar
                  </Text>
                )}
              </View>
            )}
            onEndReached={() => {
              if (totalData > totalLimit) setMoreItems(moreItems + 1);
            }}
            onEndReachedThreshold={0}
          />
        ) : (
          items.length !== 0 && (
            <FlatList
              data={items}
              renderItem={({ item, index }) => (
                <GridSearch renderItems={item} more={index} />
              )}
              keyExtractor={(item, index) => index}
              ListFooterComponent={() => (
                <View
                  style={{
                    height: 100,
                    background: "#ffffff",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: 20,
                  }}
                >
                  {/* {totalData > totalLimit && (
                    <ActivityIndicator size="large" color="#5E2129" />
                  )} */}
                  {totalData === totalLimit && (
                    <Text style={{ fontFamily: "light", fontSize: 14 }}>
                      No hay mas negocios por mostrar
                    </Text>
                  )}
                </View>
              )}
              onEndReached={() => {
                if (totalData > totalLimit) setMoreItems(moreItems + 1);
              }}
              onEndReachedThreshold={0}
            />
          )
        )}
      </View>
    );
  } else {
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
  }
};

export default Search;
