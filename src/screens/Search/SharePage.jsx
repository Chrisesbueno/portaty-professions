import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Linking,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import * as customSearch from "@/graphql/CustomQueries/Search";
import CustomSelect from "@/components/CustomSelect";
import styles from "@/utils/styles/SharePage.js";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
  Foundation,
  EvilIcons,
  Feather,
  Fontisto,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import { Auth, API, Storage } from "aws-amplify";
import * as queries from "@/graphql/CustomQueries/Favorites";
import * as customFavorites from "@/graphql/CustomMutations/Favorites";
import * as subscriptions from "@/graphql/CustomSubscriptions/Search";
import MapView, { Marker } from "react-native-maps";
import SkeletonExample from "@/components/SkeletonExample";
// recoil
import { useRecoilState, useRecoilValue } from "recoil";
import { updateListFavorites, userAuthenticated } from "@/atoms/index";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import { useRef } from "react";
import ModalAlert from "@/components/ModalAlert";
import CustomButton from "@/components/CustomButton";
import ModalReport from "@/components/ModalReport";

const SharePage = ({ route, navigation }) => {
  const userAuth = useRecoilValue(userAuthenticated);
  const [post, setPost] = useState(null);
  const [save, setSave] = useState("");
  const [open, setOpen] = useState(false);
  const [nothing, setNothing] = useState(false);
  const [numberFavorite, setNumberFavorite] = useState(0);
  const [dimensionsImages, setDimensionsImages] = useState(0);
  const [showAgg, setShowAgg] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imageView, setImageView] = useState(null);
  const [actividad, setActividad] = useState(null);
  const [images, setImages] = useState([]);
  const [listUpdate, setListUpdate] = useRecoilState(updateListFavorites);
  const global = require("@/utils/styles/global.js");
  const params = route.params;

  const getPdf = async () => {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }

    const api = "api-professions-gateway";
    const path = "/documentqr";
    const params = {
      headers: {},
      queryStringParameters: {
        path: `https://www.portaty.com/share/business?id=${params?.id}`,
      },
    };

    try {
      const response = await API.get(api, path, params);
      await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        "qr.pdf",
        "application/pdf"
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, response["pdf_base64"], {
            encoding: FileSystem.EncodingType.Base64,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log("Error en pdf: ", error.message);
    }
  };

  const onViewRef = useRef((viewableItems) => {
    if (viewableItems.changed[0].isViewable)
      setDimensionsImages(viewableItems.changed[0].item.key);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 20 });

  const onCreateFavorite = async () => {
    try {
      const { attributes } = await Auth.currentAuthenticatedUser();
      const favorites = await API.graphql({
        query: customFavorites.createFavorites,
        variables: {
          input: {
            businessID: post?.id,
            userID: attributes["custom:userTableID"],
            position: 0,
          },
        },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      setSave(favorites?.data?.createFavorites?.id);
      setNumberFavorite(post?.favorites?.items?.length + 1);
      setListUpdate(!listUpdate);
    } catch (error) {
      console.log("ERRO AL CARGAR UN FAVORITO: ", error);
    }
  };

  const onDeleteFavorite = async () => {
    // return
    const favorites = await API.graphql({
      query: customFavorites.deleteFavorites,
      variables: {
        input: {
          id: save,
        },
      },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    setSave("");
    setListUpdate(!listUpdate);
    setNumberFavorite(0);
  };

  const fetchData = async () => {
    try {
      const business = await API.graphql({
        query: customSearch.getBusiness,
        variables: {
          id: params?.id,
        },
        authMode: "AWS_IAM",
      });
      if (
        userAuth?.attributes["custom:userTableID"] ===
        business?.data?.getBusiness?.userID
      ) {
        setShowAgg(false);
      } else {
        setShowAgg(true);
      }
      const list = business?.data?.getBusiness?.images
        .map((image) => JSON.parse(image))
        .sort((a, b) => a.key - b.key);

      setImages(list);
      const getA = JSON.parse(business?.data?.getBusiness?.activity);

      setActividad(getA);

      return setPost(business?.data?.getBusiness);
    } catch (error) {
      setNothing(true);
      console.log("ERROR EN BUSCAR: ", error);
    }
  };
  const fetchFavorite = async () => {
    try {
      const { attributes } = await Auth.currentAuthenticatedUser();
      const favorite = await API.graphql({
        query: queries.favoritesByBusinessID,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          businessID: params?.id,
          userID: { eq: attributes["custom:userTableID"] },
        },
      });

      if (favorite?.data?.favoritesByBusinessID?.items?.length !== 0)
        setSave(favorite?.data?.favoritesByBusinessID?.items[0]?.id);
    } catch (error) {
      console.log("Error en buscar favoritos: ", error);
    }
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
        message: `Han compartido contigo un negocio, da click para mirarlo https://www.portaty.com/share/business?id=${params?.id}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  const openCall = () => {
    const url = `tel://${post?.phone}`;
    Linking.openURL(url);
  };
  useEffect(() => {
    if (!save) fetchFavorite();
    fetchData();
  }, [save]);
  if (!post && nothing)
    return (
      <View
        style={[
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
          global.bgWhite,
        ]}
      >
        <Text style={{ fontSize: 16, fontFamily: "regular" }}>
          No se encuentra el negocio
        </Text>
        <CustomButton
          text={`Regresar al inicio`}
          handlePress={() => navigation.goBack()}
          textStyles={[styles.textSearch, global.black]}
          buttonStyles={[styles.search, global.bgYellow]}
        />
      </View>
    );
  if (!post && nothing === false) return <SkeletonExample />;
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
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              width: 320,
              height: 250,
              position: "relative",
            },
          ]}
        >
          {images.length !== 1 &&
            dimensionsImages + 1 > 1 &&
            dimensionsImages <= 3 && (
              <View
                style={[
                  global.bgYellow,
                  {
                    width: 25,
                    height: 25,
                    position: "absolute",
                    zIndex: 10,
                    left: 0,
                    top: "50%",
                    opacity: 0.85,
                    borderRadius: 5,
                  },
                ]}
              >
                <Entypo name="triangle-left" size={24} color="#1f1f1f" />
              </View>
            )}
          {images.length !== 1 &&
            dimensionsImages >= 0 &&
            dimensionsImages < images.length - 1 && (
              <View
                style={[
                  global.bgYellow,
                  {
                    width: 25,
                    height: 25,
                    position: "absolute",
                    zIndex: 10,
                    top: "50%",
                    right: 0,
                    opacity: 0.85,
                    borderRadius: 5,
                  },
                ]}
              >
                <Entypo name="triangle-right" size={24} color="#1f1f1f" />
              </View>
            )}
          <FlatList
            horizontal
            data={images}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flex: 1,
                  width: 320,
                  height: 250,
                }}
              >
                <Pressable
                  onPress={() => {
                    setOpen(!open);
                    setImageView(item);
                  }}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                      borderRadius: 5,
                      backgroundColor: "#fff",
                      borderWidth: 0.7,
                      borderColor: "#1f1f1f",
                    }}
                    source={{ uri: item.url }}
                  />
                </Pressable>

                <TouchableOpacity
                  style={[
                    {
                      flexDirection: "row",
                      padding: 8,
                      borderRadius: 5,
                      opacity: 0.7,
                      alignItems: "center",
                      marginBottom: 5,
                      position: "absolute",
                      right: 0,
                      borderWidth: 0.8,
                      borderColor: "#1f1f1f",
                    },
                    global.bgYellow,
                  ]}
                  onPress={() => {
                    setOpen(!open);
                    setImageView(item);
                  }}
                >
                  <Text
                    style={[
                      { fontFamily: "medium", fontSize: 17 },
                      global.black,
                    ]}
                  >
                    {item.key + 1}/{images.length}
                  </Text>
                  <MaterialCommunityIcons
                    name="image-search-outline"
                    size={18}
                    color="#1f1f1f"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index}
            viewabilityConfig={viewConfigRef.current}
            onViewableItemsChanged={onViewRef.current}
          />
        </View>
        {showAgg && (
          <View>
            <View
              style={{
                // flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,
                paddingHorizontal: 100,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 24, fontFamily: "medium" }}>
                  {numberFavorite
                    ? numberFavorite
                    : post?.favorites?.items?.length}
                </Text>
                <Text style={{ fontSize: 20, fontFamily: "light" }}>
                  Favoritos
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (save === "") {
                    onCreateFavorite();
                  } else {
                    onDeleteFavorite();
                  }
                }}
              >
                {save === "" ? (
                  <Image
                    style={{
                      width: 45,
                      height: 45,
                      resizeMode: "cover",
                    }}
                    source={require("@/utils/images/nofavorites.png")}
                  />
                ) : (
                  <Image
                    style={{
                      width: 45,
                      height: 45,
                      resizeMode: "cover",
                    }}
                    source={require("@/utils/images/sifavorites.png")}
                  />
                )}
              </TouchableOpacity>
            </View>
            {/* Reporte */}
            {/* <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                paddingHorizontal: 20,
                paddingBottom: 5,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => setVisible(true)}
            >
              <MaterialIcons name="report" size={22} color="black" />
              <Text
                style={[
                  global.black,
                  {
                    fontFamily: "bold",
                    fontSize: 12,
                    // marginLeft: 2,
                    // marginBottom: 3
                  },
                ]}
              >
                Reportar negocio
              </Text>
            </TouchableOpacity> */}
          </View>
        )}

        {/* Reporte */}
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            paddingHorizontal: 20,
            paddingBottom: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => setVisible(true)}
        >
          <MaterialIcons name="report" size={22} color="black" />
          <Text
            style={[
              global.black,
              {
                fontFamily: "bold",
                fontSize: 12,
                // marginLeft: 2,
                // marginBottom: 3
              },
            ]}
          >
            Reportar negocio
          </Text>
        </TouchableOpacity>

        <View style={[styles.line, global.bgMidGray]} />
        <TouchableOpacity
          style={{
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() =>
            onOpenMap(post?.coordinates.lat, post?.coordinates.lon, post?.name)
          }
        >
          <View
            style={{
              flex: 1,
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 40,
              borderWidth: 0.7,
              borderColor: "#1f1f1f",
            }}
          >
            <MapView
              style={{
                width: "100%",
                height: 220,
              }}
              scrollEnabled={false}
              initialRegion={{
                latitude: post?.coordinates.lat,
                longitude: post?.coordinates.lon,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: post?.coordinates.lat,
                  longitude: post?.coordinates.lon,
                }}
                title={post?.name}
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
            marginTop: -53,
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
                  borderWidth: 0.7,
                  borderColor: "#1f1f1f",
                },
                global.bgYellow,
              ]}
            >
              <EvilIcons name="share-google" size={33} color="#1f1f1f" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "medium", fontSize: 15 }}>
                Compartir
              </Text>
              <Text style={{ fontFamily: "light", fontSize: 12, width: 150 }}>
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
        {/* <TouchableOpacity
          style={{
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: -27,
          }}
          onPress={getPdf}
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
                  borderWidth: 0.7,
                  borderColor: "#1f1f1f",
                },
                global.bgYellow,
              ]}
            >
              <AntDesign name="qrcode" size={24} color="#1f1f1f" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "medium", fontSize: 15 }}>
                Descargar QR
              </Text>
              <Text style={{ fontFamily: "light", fontSize: 12, width: 150 }}>
                Descarga el QR del negocio para pegarlo en donde quieras
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
        </TouchableOpacity> */}
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
                  borderWidth: 0.7,
                  borderColor: "#1f1f1f",
                },
                global.bgYellow,
              ]}
            >
              <Feather name="phone-call" size={20} color="#1f1f1f" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "medium", fontSize: 15 }}>Llamar</Text>
              <Text style={{ fontFamily: "light", fontSize: 12, width: 150 }}>
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
          <Text style={{ fontSize: 22, fontFamily: "regular", padding: 10 }}>
            Datos
          </Text>
          <View style={[styles.line, global.bgMidGray]} />
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
                  { fontFamily: "lightItalic", fontSize: 13 },
                  global.black,
                ]}
              >
                Nombre
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[{ fontSize: 13, fontFamily: "regular" }]}>
                {post?.name}
              </Text>
            </View>
          </View>
          <View style={[styles.line, global.bgMidGray]} />
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
                  { fontFamily: "lightItalic", fontSize: 13 },
                  global.black,
                ]}
              >
                Area
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  {
                    fontSize: 13,
                    fontFamily: "regular",
                    // textTransform: "capitalize",
                  },
                ]}
              >
                {actividad.main}
              </Text>
            </View>
          </View>
          <View style={[styles.line, global.bgMidGray]} />
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
                  { fontFamily: "lightItalic", fontSize: 13 },
                  global.black,
                ]}
              >
                Actividad
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  {
                    fontSize: 13,
                    fontFamily: "regular",
                    // textTransform: "capitalize",
                  },
                ]}
              >
                {actividad.sub}
              </Text>
            </View>
          </View>
          <View style={[styles.line, global.bgMidGray]} />
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
                  { fontFamily: "lightItalic", fontSize: 13 },
                  global.black,
                ]}
              >
                Descripcion
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={[
                  {
                    width: 200,
                    fontSize: 13,
                    fontFamily: "regular",
                    textAlign: "right",
                  },
                ]}
              >
                {post?.description}
              </Text>
            </View>
          </View>
          <View style={[styles.line, global.bgMidGray]} />
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
                  { fontFamily: "lightItalic", fontSize: 13 },
                  global.black,
                ]}
              >
                Telefono
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[{ fontSize: 13, fontFamily: "regular" }]}>
                {post?.phone}
              </Text>
            </View>
          </View>
          <View style={[styles.line, global.bgMidGray]} />
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
                  { fontFamily: "lightItalic", fontSize: 13 },
                  global.black,
                ]}
              >
                WhatsApp
              </Text>
            </View>
            <Pressable
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                let isWhatsAppLink =
                  item?.business?.phone.startsWith("https://wa.me/") ||
                  item?.business?.phone.startsWith(
                    "https://api.whatsapp.com/send?text="
                  );
                if (isWhatsAppLink) {
                  const url = `${item?.business?.phone}`;
                  Linking.openURL(url);
                } else {
                  const phoneRegex = item?.business?.phone.replace("+", "");
                  const url = `https://wa.me/${phoneRegex}`;
                  Linking.openURL(url);
                }
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 13,
                    fontFamily: "regular",
                    marginRight: 5,
                    color: "blue",
                  },
                ]}
              >
                {"Ir al WhatsApp"}
              </Text>
              <Feather name="external-link" size={16} color="blue" />
            </Pressable>
          </View>
          <View style={[styles.line, global.bgMidGray]} />
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
                  { fontFamily: "lightItalic", fontSize: 13 },
                  global.black,
                ]}
              >
                Correo
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[{ fontSize: 13, fontFamily: "regular" }]}>
                {post?.email}
              </Text>
            </View>
          </View>
          {/* <View style={[styles.line, global.bgMidGray]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="web" size={24} color="#1f1f1f" />
              <Text
                style={[
                  { fontFamily: "lightItalic", fontSize: 13 },
                  global.black,
                ]}
              >
                Web
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  { fontSize: 13, fontFamily: "regular", marginRight: 5 },
                ]}
              >
                Link
              </Text>
              <AntDesign name="link" size={16} color="#1f1f1f" />
            </View>
          </View> */}
          <View style={[styles.line, global.bgMidGray]} />
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
                  { fontFamily: "lightItalic", fontSize: 13 },
                  global.black,
                ]}
              >
                Instagram
              </Text>
            </View>
            <Pressable
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                if (post?.instagram === "" || post?.instagram === null) return;
                const url = `https://www.instagram.com/${post?.instagram}`;
                Linking.openURL(url);
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 13,
                    fontFamily: "regular",
                    marginRight: 5,
                    color:
                      post?.instagram === "" || post?.instagram === null
                        ? "#1f1f1f"
                        : "blue",
                  },
                ]}
              >
                {post?.instagram === "" || post?.instagram === null
                  ? "No"
                  : post?.instagram}
              </Text>
              {post?.instagram === "" || post?.instagram === null ? (
                ""
              ) : (
                <Feather name="external-link" size={16} color="#1f1f1f" />
              )}
            </Pressable>
          </View>
          <View style={[styles.line, global.bgMidGray]} />
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
                  { fontFamily: "lightItalic", fontSize: 13 },
                  global.black,
                ]}
              >
                Facebook
              </Text>
            </View>
            <Pressable
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                if (post?.facebook === "" || post?.facebook === null) return;
                const url = `https://www.facebook.com/${post?.facebook}`;
                Linking.openURL(url);
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 13,
                    fontFamily: "regular",
                    marginRight: 5,
                    color:
                      post?.facebook === "" || post?.facebook === null
                        ? "#1f1f1f"
                        : "blue",
                  },
                ]}
              >
                {post?.facebook === "" || post?.facebook === null
                  ? "No"
                  : post?.facebook}
              </Text>
              {post?.facebook === "" || post?.facebook === null ? (
                ""
              ) : (
                <Feather name="external-link" size={16} color="blue" />
              )}
            </Pressable>
          </View>
          <View style={[styles.line, global.bgMidGray]} />
        </View>
        <Modal
          animationType="none"
          transparent={true}
          visible={open}
          onRequestClose={() => {
            setOpen(!open);
            setImageView(null);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setOpen(!open);
              setImageView(null);
            }}
          >
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent]}>
                  <View style={styles.modalTop}>
                    <Pressable
                      onPress={() => {
                        setOpen(!open);
                        setImageView(null);
                      }}
                    >
                      <Image
                        style={{
                          width: 35,
                          height: 35,
                          resizeMode: "contain",
                        }}
                        source={require("@/utils/images/arrow_back.png")}
                      />
                    </Pressable>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Image
                      style={{
                        width: "100%",
                        height: "60%",
                        resizeMode: "contain",
                        borderRadius: 5,
                        borderWidth: 0.7,
                        borderColor: "#1f1f1f",
                      }}
                      source={{
                        uri: imageView?.url ? imageView?.url : imageView?.uri,
                      }}
                    />
                    {imageView?.url && (
                      <View style={{ flex: 1, paddingVertical: 15 }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            borderColor: "#1f1f1f",
                            borderWidth: 0.7,
                            paddingHorizontal: 10,
                            borderRadius: 8,
                            marginTop: 10,
                          }}
                        >
                           {imageView?.key === 0 ? (
                            <TextInput
                              value={
                                imageView?.description !== ""
                                  ? imageView?.description
                                  : post?.description
                              }
                              editable={false}
                              style={{
                                flex: 1,
                                // width: 100,
                                fontFamily: "regular",
                                fontSize: 14,
                                alignItems: "flex-start",
                                color: "#000",
                              }}
                              multiline={true}
                              numberOfLines={5}
                            />
                          ) : (
                            <TextInput
                              value={imageView?.description}
                              editable={false}
                              style={{
                                flex: 1,
                                // width: 100,
                                fontFamily: "regular",
                                fontSize: 14,
                                alignItems: "flex-start",
                                color: "#000",
                              }}
                              multiline={true}
                              numberOfLines={5}
                            />
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* <TouchableOpacity
          onPress={() => setVisible(true)}
          style={{ marginBottom: 100 }}
        >
          <Text>Modal</Text>
        </TouchableOpacity> */}
        <ModalReport
          businessID={post?.id}
          close={() => setVisible(false)}
          open={visible}
        />
      </ScrollView>
    </View>
  );
};

export default SharePage;
