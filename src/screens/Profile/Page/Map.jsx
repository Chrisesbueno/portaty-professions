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
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import styles from "@/utils/styles/MapMarket.module.css";
import * as mutations from "@/graphql/CustomMutations/Profile";
import { API } from "aws-amplify";

const Map = ({ navigation, route }) => {
  const global = require("@/utils/styles/global.js");
  const { coordinates, businessid } = route?.params;
  const [modalVisible, setModalVisible] = useState(true);
  const [marketCoordinate, setMarketCoordinate] = useState(coordinates);
  const [initialCoor, setInitialCoor] = useState(coordinates);
  const [disabledBtn, setDisableBtn] = useState(true);
  const [disabledBtn2, setDisableBtn2] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkInitalCoor();
  }, [marketCoordinate]);

  const checkInitalCoor = () => {
    if (
      marketCoordinate.latitude !== initialCoor.latitude ||
      marketCoordinate.longitude !== initialCoor.longitude
    ) {
      console.log("Es diferente el coor");
      setDisableBtn(false);
      setDisableBtn2(false);
    } else {
      setDisableBtn(true);
      setDisableBtn2(true);
    }
  };
  // Cerrar modal y vista
  const onChangeModalVisible = () => {
    close();
  };
  // cuando presionan doble click en el mapa
  const onHandleDoublePress = (e) => {
    const {
      nativeEvent: { coordinate },
    } = e;
    console.log(coordinate);
    setMarketCoordinate(coordinate);
  };
  //   cuando mueven el market
  const onHandleMarketMove = (e) => {
    let {
      nativeEvent: { coordinate },
    } = e;
    console.log(coordinate);
    setMarketCoordinate(coordinate);
  };

  const onHandleConfirmLocation = async () => {
    setLoading(true);
    try {
      await API.graphql({
        authMode: "AMAZON_COGNITO_USER_POOLS",
        query: mutations.updateBusinessPage,
        variables: {
          input: {
            id: businessid,
            coordinates: {
              lat: marketCoordinate?.latitude,
              lon: marketCoordinate?.longitude,
            },
          },
        },
      });
    } catch (error) {
      console.log("ERROR EN CARGAR", error);
    }
    setTimeout(() => {
      close();
    }, 3000);
  };
  const onSetInitalCoordinate = () => {
    setMarketCoordinate(initialCoor);
  };

  const close = () => {
    setModalVisible(!modalVisible);
    setDisableBtn(true);
    setDisableBtn2(true);
    setLoading(false);
    navigation.goBack();
  };
  return (
    <View>
      <Modal animationType="none" transparent={false} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              <Pressable onPress={onChangeModalVisible}>
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
                showsPointsOfInterest={false}
                initialRegion={{
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onDoublePress={onHandleDoublePress}
                zoomTapEnabled={false}
              >
                <Marker
                  key={1}
                  title="Contenido del Callout"
                  coordinate={marketCoordinate}
                  draggable
                  onDragEnd={onHandleMarketMove}
                ></Marker>
              </MapView>

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
                disabled={disabledBtn}
                onPress={onHandleConfirmLocation}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#1f1f1f" />
                ) : (
                  <Text
                    style={[global.black, { fontFamily: "bold" }]}
                  >{`Confirmar`}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    borderRadius: 5,
                    width: 150,
                    alignItems: "center",
                    borderColor: "#1f1f1f",
                    borderWidth: 1,
                  },
                  global.bgYellow,
                ]}
                disabled={disabledBtn2}
                onPress={onSetInitalCoordinate}
              >
                <Text
                  style={[global.black, { fontFamily: "bold" }]}
                >{`Ubicacion Inicial`}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Map;
