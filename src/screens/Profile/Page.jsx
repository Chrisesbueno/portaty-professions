import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Platform,
  Linking,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import CustomSelect from "@/components/CustomSelect";
import styles from "@/utils/styles/Unprofile.module.css";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
  Foundation,
  EvilIcons,
  Feather,
} from "@expo/vector-icons";
import { Auth, API, Storage } from "aws-amplify";
import * as queries from "@/graphql/CustomQueries/Favorites";
import * as customFavorites from "@/graphql/CustomMutations/Favorites";
import MapView, { Marker } from "react-native-maps";
import SkeletonPage from "@/components/SkeletonPage";
import * as ImagePicker from "expo-image-picker";
import ModalAlert from "@/components/ModalAlert";
import Swiper from "react-native-swiper";
// amplify
import { getBusiness } from "@/graphql/CustomQueries/Profile";

const Page = ({ route, navigation }) => {
  /*  */
  const { data } = route.params;
  const [selectedImages, setSelectedImages] = useState([]);
  const [storageImages, setStorageImages] = useState([]);
  const [viewImag, setViewImg] = useState([]);
  const [storagePaths, setStoragePaths] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [item, setItem] = useState(data?.item);
  const global = require("@/utils/styles/global.js");
  // const {
  //   data: { item, image },
  // } = route.params;

  const onOpenMap = (lat, lng, name) => {
    let url = "";
    if (Platform.OS === "android") {
      url = `geo:${lat},${lng}?q=${lat},${lng}(${name})`;
    } else {
      url = `maps://app?saddr=${lat},${lng}&daddr=${lat},${lng}&q=${lat},${lng}(${name})`;
    }
    Linking.openURL(url);
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Han compartido contigo un negocio, da click para mirarlo https://www.portaty.com/share/business?id=${item.id}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const selectImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      if (result.assets.length > 4) {
        setVisible(true);
      } else {
        setSelectedImages(result.assets.map((i) => i.uri));
        uploadImages(result.assets);
      }
    }
  };
  function urlToBlob(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  }
  const uploadImages = async (images) => {
    images.forEach(async (image, index) => {
      const blob = await urlToBlob(image.uri);
      try {
        const { key } = await Storage.put(
          `business/${item.id}/incoming/image_${image.assetId}.jpg`,
          blob,
          {
            level: "protected",
            contentType: "image/jpeg",
            metadata: {
              businessid: item.id,
              imagetype: "extras",
              key: index + 1,
            },
          }
        );
        console.log(key);
      } catch (error) {
        console.log("aqui", error);
      }
    });
  };

  const AllImages = async () => {
    try {
      // en realidad el arreglo de Objectos no sirve pa mucho
      const arregloDeObjetos = item?.images
        ?.map((image) => JSON.parse(image))
        .sort((a, b) => a.key - b.key)
        .map((image) => {
          return image.url;
        });
      // aqui agarre lo que estaba en item.images lo organice por la key y lo meti en
      // ImageCarousel que es un componente
      const ejemplo = item?.images
        ?.map((image) => JSON.parse(image))
        .sort((a, b) => a.key - b.key)
        .map((image, index) => {
          return <ImageCarousel uri={image.url} />;
        });

      setStorageImages(arregloDeObjetos);

      // si habia mas de cuatro imagenes no coloco la vista agregar mas fotos
      if (ejemplo?.length < 4) ejemplo.push(<AddImageView />);
      setViewImg(ejemplo);
    } catch (error) {
      console.log(error);
    }
  };

  const ImageCarousel = ({ uri, index }) => {
    return (
      <View
        style={{
          // width: 310,
          // height: 230,
          borderRadius: 5,
          borderColor: "#efeded",
          borderWidth: 1,
          overflow: "hidden",
          padding: 10,
          marginBottom: 20,
          marginTop: 20,
          // position: "relative",
        }}
        // key={index}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "cover",
            borderRadius: 5,
            backgroundColor: "#fff",
          }}
          source={{ uri: uri }}
        />
      </View>
    );
  };

  const AddImageView = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={[
            {
              flexDirection: "row",
              padding: 8,
              borderRadius: 5,
              opacity: 0.95,
              alignItems: "center",
            },
            global.mainBgColor,
          ]}
          onPress={selectImages}
        >
          <MaterialCommunityIcons
            name="camera-plus-outline"
            size={23}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={[{ fontFamily: "medium" }, global.white]}>
            agregar mas fotos
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    if (item) {
      AllImages();
    }
  }, [item]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await onRefreshBusiness(item?.id);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const onRefreshBusiness = async (id) => {
    console.log(id);
    try {
      const result = await API.graphql({
        query: getBusiness,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          id,
        },
      });
      // setItem(result?);
      setItem(result?.data?.getBusiness);
      // console.log(result?.data?.getBusiness);
    } catch (error) {}
  };

  if (!item || storageImages?.length === 0) return <SkeletonPage />;
  return (
    <View
      style={[
        {
          flex: 1,
        },
        global.bgWhite,
      ]}
    >
      <ScrollView
        style={{ flex: 1, marginTop: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={[
            {
              flex: 1,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          {viewImag?.length !== 0 && (
            <Swiper
              style={{
                // width: 340,
                height: 260,
                alignItems: "center",
                justifyContent: "center",
              }}
              showsButtons={true}
              loop={false}
              onIndexChanged={(index) => setCurrentIndex(index)}
              onMomentumScrollEnd={(e, state) => setCurrentIndex(state.index)}
              nextButton={
                <Text
                  style={{
                    color:
                      currentIndex < storageImages?.length - 1
                        ? "#fb8500"
                        : "transparent",
                    fontSize: 50,
                  }}
                >
                  ›
                </Text>
              }
              prevButton={
                <Text
                  style={{
                    color: currentIndex > 0 ? "#fb8500" : "transparent",
                    fontSize: 50,
                  }}
                >
                  ‹
                </Text>
              }
              activeDotColor="#000"
            >
              {viewImag?.map((item, index) => (
                <View style={{ flex: 1 }} key={index}>
                  {item}
                </View>
              ))}
              {/* <TouchableOpacity
                style={[
                  {
                    position: "absolute",
                    padding: 8,
                    borderRadius: 5,
                    opacity: 0.95,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    columnGap: 5,
                    alignItems: "center",
                    bottom: 0,
                    right: 0,
                  },
                  global.mainBgColor,
                ]}
                onPress={selectImages}
                activeOpacity={1}
              >
                <MaterialCommunityIcons
                  name="camera-plus-outline"
                  size={23}
                  color="white"
                />
                <Text style={[{ fontFamily: "medium" }, global.white]}>
                  agregar mas fotos
                </Text>
              </TouchableOpacity> */}
            </Swiper>
          )}
        </View>
        <View
          style={{
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 26, fontFamily: "thin" }}>
            {item.favorites?.items?.length}
          </Text>
          <Text style={{ fontSize: 22, fontFamily: "thin" }}>Favoritos</Text>
        </View>
        <View style={[styles.line, global.bgWhiteSmoke]} />
        <TouchableOpacity
          style={{
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() =>
            onOpenMap(item.coordinates.lat, item.coordinates.lon, item.name)
          }
        >
          <View
            style={{
              flex: 1,
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 40,
            }}
          >
            <MapView
              style={{
                width: "100%",
                height: 220,
              }}
              initialRegion={{
                latitude: item.coordinates.lat,
                longitude: item.coordinates.lon,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              }}
              scrollEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: item.coordinates.lat,
                  longitude: item.coordinates.lon,
                }}
                title={item.name}
              />
            </MapView>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={onShare}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                {
                  width: 58,
                  height: 58,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                },
                global.mainBgColor,
              ]}
            >
              <EvilIcons name="share-google" size={25} color="white" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "light", fontSize: 16 }}>
                Compartir
              </Text>
              <Text style={{ fontFamily: "thin", fontSize: 12, width: 150 }}>
                Compartelo con tus amigos y familiares
              </Text>
            </View>
          </View>
          <Image
            style={{
              width: 40,
              height: 40,
              resizeMode: "cover",
            }}
            source={require("@/utils/images/arrow_right.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: -25,
          }}
          onPress={() => {
            navigation.navigate("ViewQR", {
              id: `https://www.portaty.com/share/business?id=${item.id}`,
              name: item.name,
            });
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                {
                  width: 58,
                  height: 58,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                },
                global.mainBgColor,
              ]}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={25}
                color="white"
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "light", fontSize: 16 }}>Ver QR</Text>
              <Text style={{ fontFamily: "thin", fontSize: 12, width: 150 }}>
                Compartelo en formato QR para pegarlo en donde quieras
              </Text>
            </View>
          </View>
          <Image
            style={{
              width: 40,
              height: 40,
              resizeMode: "cover",
            }}
            source={require("@/utils/images/arrow_right.png")}
          />
        </TouchableOpacity>
        <View style={{ marginBottom: 80 }}>
          <Text style={{ fontSize: 22, fontFamily: "thinItalic", padding: 10 }}>
            Datos
          </Text>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <Foundation name="torso-business" size={22} color="#1f1f1f" /> */}
              <Text
                style={[
                  { fontFamily: "thinItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                Razon social
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[{ fontSize: 13, fontFamily: "lightItalic" }]}>
                {item.name}
              </Text>
            </View>
          </View>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <FontAwesome5 name="store" size={16} color="#1f1f1f" /> */}
              <Text
                style={[
                  { fontFamily: "thinItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                Actividad laboral
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[{ fontSize: 13, fontFamily: "lightItalic" }]}>
                {item.activity}
              </Text>
            </View>
          </View>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <FontAwesome name="phone" size={20} color="#1f1f1f" /> */}
              <Text
                style={[
                  { fontFamily: "thinItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                Telefono
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[{ fontSize: 13, fontFamily: "lightItalic" }]}>
                {item.phone}
              </Text>
            </View>
          </View>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <FontAwesome name="whatsapp" size={22} color="#1f1f1f" /> */}
              <Text
                style={[
                  { fontFamily: "thinItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                WhatsApp
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[{ fontSize: 13, fontFamily: "lightItalic" }]}>
                {item.whatsapp}
              </Text>
            </View>
          </View>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <MaterialCommunityIcons
                name="email-open-multiple-outline"
                size={20}
                color="#1f1f1f"
              /> */}
              <Text
                style={[
                  { fontFamily: "thinItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                Correo
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[{ fontSize: 13, fontFamily: "lightItalic" }]}>
                {item.email}
              </Text>
            </View>
          </View>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <MaterialCommunityIcons name="web" size={24} color="#1f1f1f" /> */}
              <Text
                style={[
                  { fontFamily: "thinItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                Web
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  { fontSize: 13, fontFamily: "lightItalic", marginRight: 5 },
                ]}
              >
                Link
              </Text>
              <AntDesign name="link" size={16} color="#1f1f1f" />
            </View>
          </View>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <FontAwesome name="instagram" size={24} color="#1f1f1f" /> */}
              <Text
                style={[
                  { fontFamily: "thinItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                Instagram
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  { fontSize: 13, fontFamily: "lightItalic", marginRight: 5 },
                ]}
              >
                Link
              </Text>
              <AntDesign name="link" size={16} color="#1f1f1f" />
            </View>
          </View>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <FontAwesome name="facebook-square" size={24} color="#1f1f1f" /> */}
              <Text
                style={[
                  { fontFamily: "thinItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                Facebook
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  { fontSize: 13, fontFamily: "lightItalic", marginRight: 5 },
                ]}
              >
                Link
              </Text>
              <AntDesign name="link" size={16} color="#1f1f1f" />
            </View>
          </View>
          <View style={[styles.line, global.bgWhiteSmoke]} />
        </View>
        <ModalAlert
          text={`Error al guardar imagenes. Por favor, selecciona un máximo de 4 imágenes`}
          close={() => setVisible(false)}
          icon={require("@/utils/images/alert.png")}
          open={visible}
        />
      </ScrollView>
    </View>
  );
};

export default Page;
