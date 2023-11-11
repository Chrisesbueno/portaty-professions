import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Share,
  Linking,
  Platform,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
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
import * as customSearch from "@/graphql/CustomQueries/Search";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import ModalAlert from "@/components/ModalAlert";
import Swiper from "react-native-swiper";
import SkeletonExample from "@/components/SkeletonExample";

const FavoritePage = ({ navigation, route }) => {
  const global = require("@/utils/styles/global.js");
  const [post, setPost] = useState([]);
  const [storageImages, setStorageImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const {
    data: { item, image },
  } = route.params;
  const fetchData = async () => {
    try {
      const business = await API.graphql({
        query: customSearch.getBusinessFavorites,
        variables: {
          id: item.businessID,
        },
        authMode: "AWS_IAM",
      });
      setPost(business.data.getBusiness);
    } catch (error) {
      console.log(error);
    }
  };
  const onDeleteFavorite = async () => {
    const favorites = await API.graphql({
      query: customFavorites.deleteFavorites,
      variables: {
        input: {
          id: item.id,
        },
      },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    navigation.goBack();
  };

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
        message: `Han compartido contigo un negocio, da click para mirarlo https://www.portaty.com/share/business?id=${item.businessID}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  const openCall = () => {
    const url = `tel://${item.business.phone}`;
    Linking.openURL(url);
  };

  const AllImages = async () => {
    try {
      const result = await Storage.list(`business/${item.businessID}/extras/`, {
        level: "protected",
        identityId: item.business.identityID,
        pageSize: 10,
      });
      const urls = await Promise.all(
        result.results.map((item) =>
          Storage.get(item.key, { level: "protected" })
            .then((url) => url)
            .catch((err) => console.log(err))
        )
      );
      setStorageImages([image, ...urls]);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    fetchData();
    AllImages();
    console.log(storageImages);
  }, []);

  if (!item || storageImages.length === 0) return <SkeletonExample />;
  return (
    <View
      style={[
        {
          flex: 1,
        },
        global.bgWhite,
      ]}
    >
      <ScrollView style={{ flex: 1, marginTop: 30 }}>
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
          {storageImages.length !== 0 && (
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
                      currentIndex < storageImages.length - 1
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
              {storageImages.map((item, index) => (
                <View
                  style={{
                    width: 310,
                    height: 230,
                    borderRadius: 5,
                    borderColor: "#efeded",
                    borderWidth: 1,
                    overflow: "hidden",
                    padding: 10,
                    marginBottom: 20,
                    marginTop: 20,
                    position: "relative",
                  }}
                  key={index}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                      borderRadius: 5,
                      backgroundColor: "#fff",
                    }}
                    source={{ uri: item }}
                  />
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
                </View>
              ))}
            </Swiper>
          )}
        </View>
        <View
          style={{
            // flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 26, fontFamily: "thin" }}>
              {post.favorites?.items.length}
            </Text>
            <Text style={{ fontSize: 22, fontFamily: "thin" }}>Favoritos</Text>
          </View>
          <TouchableOpacity
            style={[global.bgWhiteSmoke, { padding: 10, borderRadius: 8 }]}
            onPress={onDeleteFavorite}
          >
            <Text style={{ fontSize: 14, fontFamily: "thin" }}>
              Eliminar de favoritos
            </Text>
          </TouchableOpacity>
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
            onOpenMap(
              item.business.coordinates.lat,
              item.business.coordinates.lon,
              item.business.name
            )
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
              scrollEnabled={false}
              initialRegion={{
                latitude: item.business.coordinates.lat,
                longitude: item.business.coordinates.lon,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: item.business.coordinates.lat,
                  longitude: item.business.coordinates.lon,
                }}
                title={item.business.name}
              />
            </MapView>
          </View>
        </TouchableOpacity>

        {/*  */}
        <TouchableOpacity
          style={{
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: -23,
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
            marginTop: -27,
          }}
          onPress={() => {
            navigation.navigate("ViewQR", {
              id: `https://www.portaty.com/share/business?id=${item.businessID}`,
              name: item.business.name,
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
        <TouchableOpacity
          style={{
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: -27,
          }}
          onPress={openCall}
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
              <Feather name="phone-call" size={17} color="white" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "light", fontSize: 16 }}>Llamar</Text>
              <Text style={{ fontFamily: "thin", fontSize: 12, width: 150 }}>
                Contacta al negocio directamente
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
                {item.business.name}
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
                {item.business.activity}
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
                {item.business.phone}
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
                {item.business.whatsapp}
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
                {item.business.email}
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
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={{ marginBottom: 100 }}
        >
          <Text>Modal</Text>
        </TouchableOpacity>
        <ModalAlert
          text={`Tu negocio ha sido registrado con exito`}
          close={() => setVisible(false)}
          open={visible}
          icon={require("@/utils/images/error.png")}
        />
      </ScrollView>
    </View>
  );
};

export default FavoritePage;
