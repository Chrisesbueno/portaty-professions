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
  TextInput,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import * as Location from "expo-location";
import styles from "@/utils/styles/MapMarket.module.css";
import {
  directionBusiness,
  directionBusinessOn,
  emptyLocation,
  mapBusiness,
  selectLocation,
} from "@/atoms";
import { useRecoilState } from "recoil";
// hook form
import { Controller } from "react-hook-form";
import { createRef } from "react";

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
  title,
  rules = {},
}) => {
  const global = require("@/utils/styles/global.js");
  const markerRef = useRef(null);
  const [marketLocation, setMarketLocation] = useState(null);
  const [errorMap, setErrorMap] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectMap, setSelectMap] = useState(false);
  const [direction, setDirection] = useRecoilState(directionBusiness);
  const [directionOn, setDirectionOn] = useRecoilState(directionBusinessOn);
  const [selectMapBusiness, setSelectMapBusiness] = useRecoilState(mapBusiness);
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectionLocation, setSelectionLocation] =
    useRecoilState(selectLocation);
  const [selectionEmptyLocation, setSelectionEmptyLocation] =
    useRecoilState(emptyLocation);
  let mapRef = useRef();

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
      }${direccion.city === null ? "" : direccion.city} - ${
        direccion.region === null ? "" : direccion.region
      }, ${direccion.postalCode === null ? "" : direccion.postalCode} `;
      setDirection(direccionString);
      setDirectionOn(direcciones);
      console.log(direccionString);
      console.log(direcciones);
    }
  };

  const obtenerCoordenadas = async (address) => {
    console.log(mapRef);
    console.log(address);
    let coordenadas = await Location.geocodeAsync(address);
    setRegion({
      latitude: coordenadas[0].latitude,
      longitude: coordenadas[0].longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    mapRef.current.animateToRegion({
      latitude: coordenadas.latitude,
      longitude: coordenadas.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 7000);
  };


  const onHandlePress = (e) => {
    const {
      nativeEvent: { coordinate },
    } = e;
    console.log(coordinate);
    setMarketLocation(coordinate);
    setRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
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
  useEffect(() => {
    if (modalVisible) {
      if (marketLocation !== null) {
        setRegion({
          latitude: marketLocation.latitude,
          longitude: marketLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        setMarketLocation({
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
      setSelectMapBusiness({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
      });
    }
  }, [modalVisible]);

  const showTitleMarket = () => {
    markerRef?.current?.showCallout();
  };

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
                    {modalVisible && marketLocation && (
                      <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{ flex: 1 }}
                        showsUserLocation={modalVisible}
                        ref={mapRef}
                        region={region}
                        chan
                        onDoublePress={(e) => {
                          onHandlePress(e);
                          onChange(e.nativeEvent.coordinate);
                        }}
                      >
                        <Marker
                          key={1}
                          // title="Contenido del Callout"
                          coordinate={marketLocation}
                          draggable
                          onDragEnd={onHandleMarketMove}
                          ref={markerRef}
                        >
                          {/* <Callout>
                            <View style={{ padding: 5 }}>
                              <Text style={{ fontWeight: "bold" }}>
                                {title}
                              </Text>
                            </View>
                          </Callout> */}
                        </Marker>
                      </MapView>
                    )}

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
                    <View
                      style={{
                        position: "absolute",
                        flex: 1,
                        marginHorizontal: 5,
                        marginVertical: 13,
                        padding: 5,
                        borderRadius: 5,
                        borderColor: "#1f1f1f",
                        borderWidth: 0.7,
                        width: 235,
                        backgroundColor: "#fff",
                      }}
                    >
                      <TextInput
                        value={description}
                        onChangeText={(e) => {
                          setDescription(e);
                        }}
                        placeholder={`Introduce una direccion`}
                        style={{
                          fontFamily: "regular",
                          fontSize: 14,
                        }}
                      />
                      <TouchableOpacity
                        style={[
                          {
                            position: "absolute",
                            bottom: -1,
                            right: -65,
                            justifyContent: "center",
                            alignContent: "center",
                            borderRadius: 5,
                            height: 40,
                            width: 60,
                            alignItems: "center",
                            borderColor: "#1f1f1f",
                            borderWidth: 0.7,
                          },
                          global.bgYellow,
                        ]}
                        onPress={() => obtenerCoordenadas(description)}
                      >
                        {loadingSearch ? (
                          <ActivityIndicator size="small" color="#1f1f1f" />
                        ) : (
                          <Text
                            style={[
                              global.black,
                              { fontFamily: "bold", fontSize: 12 },
                            ]}
                          >{`Buscar`}</Text>
                        )}
                      </TouchableOpacity>
                    </View>

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
                        <ActivityIndicator size="small" color="#1f1f1f" />
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
