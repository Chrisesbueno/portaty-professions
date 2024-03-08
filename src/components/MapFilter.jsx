import {
  Text,
  View,
  Modal,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import * as Location from "expo-location";
import styles from "@/utils/styles/MapMarket.module.css";
import { useRecoilState } from "recoil";
import { kmRadio } from "@/atoms";
import Slider from "@react-native-community/slider";

const MapFilter = ({ open, close, initialLocation, country, city }) => {
  console.log(country, city);
  const global = require("@/utils/styles/global.js");
  const [description, setDescription] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filterRadio, setFilterRadio] = useRecoilState(kmRadio);
  const [changeTag, setChangeTag] = useState(filterRadio);
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.018,
    longitudeDelta: 0.018,
  });
  let mapRef = useRef(null);

  const onHandlePress = (e) => {
    const {
      nativeEvent: { coordinate },
    } = e;
    // console.log(e)

    if (mapRef.current) {
      const newRegion = mapRef.current.__lastRegion;
      console.log(newRegion)

    }
    console.log(coordinate);
    setRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.018,
      longitudeDelta: 0.018,
    });
    // mapRef.current.animateToRegion(
    //   {
    //     latitude: coordinate.latitude,
    //     longitude: coordinate.longitude,
    //     // latitudeDelta: 0.018,
    //     // longitudeDelta: 0.018,
    //   },
    //   7000
    // );
  };

  const obtenerCoordenadas = async (address) => {
    console.log(mapRef);
    console.log(address);
    const direccionComplete = `${address}, ${city}, ${country}`;
    let coordenadas = await Location.geocodeAsync(direccionComplete);

    let direcciones = await Location.reverseGeocodeAsync(coordenadas[0]);

    console.log(direcciones);

    if (direcciones[0].country !== country || direcciones[0].city === null) {
      console.log("No ta");
      return;
    }

    setRegion({
      latitude: coordenadas[0].latitude,
      longitude: coordenadas[0].longitude,
      latitudeDelta: 0.018,
      longitudeDelta: 0.018,
    });
    mapRef.current.animateToRegion(
      {
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude,
        latitudeDelta: 0.018,
        longitudeDelta: 0.018,
      },
      7000
    );
  };
  useEffect(() => {}, []);
  return (
    <Modal animationType="none" transparent={true} visible={open}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalTop}>
            <Pressable
              onPress={() => {
                close();
                setFilterRadio(1);
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
            <Text style={styles.modalText}>Salir</Text>
          </View>
          <View style={{ flex: 1 }}>
            {open && (
              <MapView
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                showsUserLocation={open}
                ref={mapRef}
                region={region}
                onDoublePress={(e) => {
                  onHandlePress(e);
                }}
              >
                <Circle
                  center={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                  radius={filterRadio * 1000}
                  strokeWidth={1}
                  strokeColor={"#1a66ff"}
                  fillColor={"rgba(26, 102, 255, 0.3)"}
                />
              </MapView>
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
                <Text
                  style={[global.black, { fontFamily: "bold", fontSize: 12 }]}
                >{`Buscar`}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                backgroundColor: "#ffb703",
                margin: 20,
                borderColor: "#1f1f1f",
                borderWidth: 1,
                borderRadius: 7,
                paddingVertical: 15,
                paddingHorizontal: 5,
                // flex: 1,
                alignItems: "stretch",
                justifyContent: "center",
              }}
            >
              <Slider
                value={filterRadio}
                onValueChange={(e) => {
                  if (e < 4) setChangeTag(e * 2 - 5);
                  if (e >= 4 && e < 8) setChangeTag(e * 2);
                  if (e >= 8 && e < 13) setChangeTag(e * 2 + 5);
                  if (e >= 13 && e < 15) setChangeTag(e * 2 + 8);
                  if (e === 15) setChangeTag(e * 2 + 10);
                  if (e === 16) setChangeTag(e * 2 + 12);
                  if (e === 17) setChangeTag(e * 2 + 14);
                  if (e === 18) setChangeTag(e * 2 + 16);
                  if (e === 19) setChangeTag(e * 2 + 17);
                  if (e === 20) setChangeTag(e * 2 + 17);
                  if (e === 21) setChangeTag(e * 2 + 19);
                  if (e === 22) setChangeTag(e * 2 + 21);
                  if (e === 23) setChangeTag(e * 2 + 21);
                  if (e === 24) setChangeTag(e * 2 + 22);
                  if (e >= 25 && e < 35) setChangeTag(e * 3);
                  if (e >= 35 && e < 46) setChangeTag(e * 3 + 5);
                  if (e === 46) setChangeTag(e * 3 + 6);
                  if (e === 48) setChangeTag(e * 3 + 7);
                  if (e === 49) setChangeTag(e * 3 + 8);
                  if (e === 50) setChangeTag(e * 3 + 10);

                  setFilterRadio(e);
                  console.log("menor de 25", e < 25);
                  console.log("entre 25 y 35", e >= 25 && e < 35);
                  console.log("mayor de 25", e >= 35);
                }}
                minimumValue={1}
                maximumValue={50}
                step={1}
                style={{
                  width: 200,
                }}
                thumbTintColor={`#1f1f1f`}
                minimumTrackTintColor={`#1f1f1f`}
                maximumTrackTintColor={`#fff`}
              />
              <View
                style={{
                  position: "absolute",
                  left: changeTag,
                  top: -35,
                  backgroundColor: "#fff",
                  padding: 10,
                  // borderColor: "#1f1f1f",
                  // borderWidth: 1,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "bold",
                    fontSize: 12,
                  }}
                >
                  {filterRadio} km
                </Text>
                <View
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 30,
                    width: 0,
                    height: 0,
                    backgroundColor: "transparent",
                    borderStyle: "solid",
                    borderLeftWidth: 10,
                    borderRightWidth: 10,
                    borderTopWidth: 20,
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    borderTopColor: "#fff",
                    // transform: [{ translateX: -10 }],
                  }}
                />
              </View>
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
              onPress={() => {
                close();
              }}
            >
              {/* {loading ? (
                <ActivityIndicator size="small" color="#1f1f1f" />
              ) : ( */}
              <Text
                style={[global.black, { fontFamily: "bold" }]}
              >{`Confirmar`}</Text>
              {/* )} */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MapFilter;
