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
import { useRecoilValue } from "recoil";
import { mapUser } from "@/atoms";
import * as Location from "expo-location";
import * as queries from "@/graphql/CustomQueries/Favorites";

const SearchOut = ({ route }) => {
  const global = require("@/utils/styles/global.js");
  const { input } = route.params;
  // console.log(input)
  const [moreItems, setMoreItems] = useState(1);
  const [items, setItems] = useState([]);
  const [totalData, setTotalData] = useState(2);
  const [totalLimit, setTotalLimit] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [statusFilter, setStatusFilter] = useState(false);
  const [filterRadio, setFilterRadio] = useState(1);
  let number = 26 * moreItems;
  const location = useRecoilValue(mapUser);

  const getData = async () => {
    const api = "api-opense";
    const path = "/search/input";
    const params = {
      headers: {}, // OPTIONAL
      queryStringParameters: {
        location: JSON.stringify({
          lat: location.latitude,
          lon: location.longitude,
        }),
        km: filterRadio,
        from: 0,
        text: input.trim(),
        limit: number,
      },
    };
    try {
      const response = await API.get(api, path, params);
      setTotalData(response.total);
      setTotalLimit(response.limit);
      let newRenderItems = [];
      const long = 26;
      for (let i = 0; i < response.items.length; i += long) {
        let cut = response.items.slice(i, i + long);
        newRenderItems.push(cut);
      }
      return setItems(newRenderItems);
    } catch (error) {
      console.log("Error: ", error);
      setNotFound(true);
    }
  };
  const getFilterData = async () => {
    setStatusFilter(true);
    getData();
    setTimeout(() => {
      setStatusFilter(false);
    }, 3000);
  };
  useEffect(() => {
    getData();
  }, [route, moreItems]);

  if (items.length !== 0)
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
            <Text style={{ fontFamily: "regular", fontSize: 14 }}>
              Tienes {totalData} de {input.trim()} cerca de ti
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
                  fontSize: 13,
                  fontFamily: "lightItalic",
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
                  <Slider
                    style={{ height: 100 }}
                    minimumValue={1}
                    maximumValue={100}
                    onValueChange={(e) => setFilterRadio(e)}
                    step={1}
                    minimumTrackTintColor="#fb8500"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#fb8500"
                    value={filterRadio}
                  />
                  <Text
                    style={styles.modalText}
                  >{`La distancia esta reflejada en un radio de kilometros`}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    style={[
                      global.bgYellow,
                      {
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 49,
                        marginTop: 80,
                        borderWidth: 0.7,
                        borderColor: "#1f1f1f",
                      },
                    ]}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      getFilterData();
                    }}
                  >
                    <Text
                      style={[
                        global.black,
                        { fontFamily: "bold", fontSize: 14 },
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
            <ActivityIndicator size="large" color="#ffb703" />
          </View>
        ) : (
          items !== 0 && (
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
                  {totalData > totalLimit && (
                    <ActivityIndicator size="large" color="#ffb703" />
                  )}
                  {totalData === totalLimit && (
                    <Text style={{ fontFamily: "regular", fontSize: 14 }}>
                      No hay mas resultados por: "{input.trim()}"
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
  if (totalData === 0 || notFound) {
    return (
      <View
        style={[
          { flex: 1, alignItems: "center", justifyContent: "center" },
          global.bgWhite,
        ]}
      >
        <Text
          style={[
            {
              fontFamily: "regular",
              fontSize: 15,
              textAlign: "center",
              marginBottom: 60,
              width: 330,
            },
            global.black,
          ]}
        >
          No se encuentran resultados por: "{input.trim()}"
        </Text>
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
        <ActivityIndicator size="large" color="#ffb703" />
      </View>
    );
  }
};

export default SearchOut;
