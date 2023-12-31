import "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import styles from "@/utils/styles/MapMarket.module.css";
import { directionBusiness, emptyLocation, mapBusiness, selectLocation } from "@/atoms";
import { useRecoilState } from "recoil";
// hook form
import { Controller } from "react-hook-form";

const COUNTRY_REGION = {
  // colombia
  latitude: 4.5709,
  longitude: -74.2973,
  latitudeDelta: 10, // Ajusta este valor según tus necesidades
  longitudeDelta: 10, // Ajusta este valor según tus necesidades
};

const MAP_SETTINGS = [
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];

const MapMarketBusiness = ({
  initialLocation,
  control,
  name,
  text,
  placeholder,
  rules = {},
}) => {
  const global = require("@/utils/styles/global.js");
  const [marketLocation, setMarketLocation] = useState(null);
  const [initalMarketLocation, setInitialMarketLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [errorMap, setErrorMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectMap, setSelectMap] = useState(false);
  const [direction, setDirection] = useRecoilState(directionBusiness);
  const [selectMapBusiness, setSelectMapBusiness] = useRecoilState(mapBusiness);
  const [selectionLocation, setSelectionLocation] =
    useRecoilState(selectLocation);
  const [selectionEmptyLocation, setSelectionEmptyLocation] =
    useRecoilState(emptyLocation);

  let mapRef = useRef(null);
  const onHandleMapMarket = async () => {
    setModalVisible(!modalVisible);
    setSelectionLocation(true);
  };
  const onHandleMarketMove = (e) => {
    let {
      nativeEvent: { coordinate },
    } = e;
  };
  const obtenerDireccion = async (coords) => {
    console.log(coords);
    let direcciones = await Location.reverseGeocodeAsync(coords);
    if (direcciones && direcciones.length > 0) {
      let direccion = direcciones[0];
      let direccionString = `${
        direccion.street === null ? "" : `${direccion.street}, `
      }${
        direccion.city === null ? "" : direccion.city
      } - ${direccion.region === null ? "" : direccion.region}, ${direccion.postalCode === null ? "" : direccion.postalCode} `;
      setDirection(direccionString);
      console.log(direccionString);
    }
  };
  const onHandleMarkerDragStart = (e) => {
    let {
      nativeEvent: { coordinate },
    } = e;
    setInitialMarketLocation(coordinate);
  };

  const onHandlePress = (e) => {
    const {
      nativeEvent: { coordinate },
    } = e;
    setMarketLocation(coordinate);
    setSelectMapBusiness(coordinate);
    setSelectMap(true);
  };

  const onHandleConfirm = () => {
    if (!marketLocation) return setErrorMap(true);
    setLoading(true);
    obtenerDireccion(selectMapBusiness);
    setTimeout(() => {
      setLoading(false);
      setErrorMap(false);
      setSelectMap(true);
      setSelectionLocation(false);
      setSelectionEmptyLocation(false);
      setModalVisible(!modalVisible);
    }, 2000);
  };
  useEffect(() => {}, []);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <ScrollView
          style={[global.bgWhite, { flex: 1 }]}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <TouchableOpacity
              onPress={() => onHandleMapMarket()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                marginTop: 5,
              }}
            >
              <View
                style={[
                  global.bgYellow,
                  {
                    height: 50,
                    width: 110,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    marginRight: 35,
                    borderColor: "#1f1f1f",
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    global.black,
                    {
                      fontFamily: "bold",
                      fontSize: 13,
                    },
                  ]}
                >
                  Abrir mapa
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                {direction ? (
                  <Text
                    style={styles.textTag}
                  >{`¡Tu ubicacion: ${direction} se agrego exitosamente!`}</Text>
                ) : selectionLocation ? (
                  <Text
                    style={styles.textInputTagError}
                  >{`No has seleccionado una ubicacion`}</Text>
                ) : (
                  <Text
                    style={styles.textInputTag}
                  >{`Selecciona una ubicacion`}</Text>
                )}
              </View>
            </TouchableOpacity>
            <Modal
              animationType="none"
              transparent={true}
              visible={modalVisible}
            >
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
                          width: 45,
                          height: 45,
                          resizeMode: "contain",
                          marginLeft: 15,
                        }}
                        source={require("@/utils/images/arrow_back.png")}
                      />
                    </Pressable>
                    <Text style={styles.modalText}>
                      Salir de la seleccion de ubicacion
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      style={{ flex: 1 }}
                      showsUserLocation={modalVisible}
                      ref={mapRef}
                      initialRegion={{
                        latitude: initialLocation.latitude,
                        longitude: initialLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      showsPointsOfInterest={false}
                      onDoublePress={(e) => {
                        onHandlePress(e);
                        onChange(e.nativeEvent.coordinate);
                      }}
                      // customMapStyle={MAP_SETTINGS}
                    >
                      {marketLocation && (
                        <Marker
                          title="Ubicacion de tu negocion"
                          coordinate={marketLocation}
                          draggable
                          // onDragStart={(e) => onHandleMarkerDragStart(e)}
                          onDragEnd={onHandleMarketMove}
                        />
                      )}
                    </MapView>
                    {errorMap && (
                      <Text
                        style={{
                          position: "absolute",
                          bottom: 25,
                          right: 120,
                          width: 170,
                          fontFamily: "bold",
                          color: "red",
                          fontSize: 14,
                        }}
                      >
                        Aun no seleccionaste ninguna ubicacion
                      </Text>
                    )}
                    <TouchableOpacity
                      style={[
                        {
                          position: "absolute",
                          bottom: 20,
                          right: 20,
                          paddingHorizontal: 10,
                          paddingVertical: 15,
                          borderRadius: 5,
                          width: 100,
                          alignItems: "center",
                          borderColor: "#1f1f1f",
                          borderWidth: 1,
                        },
                        global.bgYellow,
                      ]}
                      onPress={onHandleConfirm}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="black" />
                      ) : (
                        <Text
                          style={[global.black, { fontFamily: "bold" }]}
                        >{`Confirmar`}</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      )}
    />
  );
};

export default MapMarketBusiness;
