import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { API, Storage } from "aws-amplify";
import styles from "@/utils/styles/Post.module.css";
import * as customSearch from "@/graphql/CustomQueries/Search";
import { Entypo } from "@expo/vector-icons";

const Post = ({ data, image, styled }) => {
  const global = require("@/utils/styles/global.js");
  const navigation = useNavigation();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const list = data?.images
    ?.map((image) => JSON.parse(image))
    .sort((a, b) => a.key - b.key);
  const [modalVisible, setModalVisible] = useState(false);
  const fetchData = async () => {
    try {
      const business = await API.graphql({
        query: customSearch.getBusinessFavorites,
        variables: {
          id: data.id,
        },
        authMode: "AWS_IAM",
      });
      setPost(business.data.getBusiness);
    } catch (error) {
      console.log(error);
    }
  };

  const roundNumber = (num) => {
    const numero = parseFloat(num);
    return numero.toFixed(3);
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);
  // if (url)
  return (
    <>
      <TouchableOpacity
        style={[
          styled,
          {
            position: "relative",
          },
        ]}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {/* {!url ? (
            <ActivityIndicator size={`large`} color={`#fb8500`} />
          ) : ( */}
        <View style={{ height: "100%", width: "100%" }}>
          <Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
              borderRadius: 1,
            }}
            source={{
              uri: image
                ? image
                : "https://s3professions202858-dev.s3.amazonaws.com/public/assets/notfound.png",
            }}
          />
          <View
            style={{
              position: "absolute",
              right: 5,
              top: 5,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  borderWidth: 1,
                  paddingVertical: 2,
                  paddingHorizontal: 5,
                  marginLeft: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Entypo name="location-pin" size={15} color="black" />
                <Text
                  style={{
                    color: "black",
                    fontSize: 12,
                  }}
                >
                  {roundNumber(data.distance) < "1.0"
                    ? `${roundNumber(data.distance) * 1000} m`
                    : `${roundNumber(data.distance)} km`}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* )} */}
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
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
                  <Text
                    style={styles.modalText}
                  >{`Vista previa del negocio`}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Image
                    style={{
                      width: 260,
                      height: 260,
                      resizeMode: "cover",
                      borderRadius: 5,
                      borderWidth: 0.7,
                      borderColor: "#1f1f1f",
                    }}
                    source={{
                      uri: image
                        ? image
                        : "https://s3professions202858-dev.s3.amazonaws.com/public/assets/notfound.png",
                    }}
                  />
                  <View style={{ paddingVertical: 15 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ fontFamily: "light", fontSize: 13 }}>
                        Nombre:
                      </Text>
                      <Text style={{ fontFamily: "regular", fontSize: 14 }}>
                        {data?.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ fontFamily: "light", fontSize: 13 }}>
                        Actividad:
                      </Text>
                      <Text
                        style={{
                          fontFamily: "regular",
                          fontSize: 14,
                          textTransform: "capitalize",
                        }}
                      >
                        {data.activity}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ fontFamily: "light", fontSize: 13 }}>
                        Distancia de ti:
                      </Text>
                      <Text
                        style={{
                          fontFamily: "regular",
                          fontSize: 14,
                        }}
                      >
                        {roundNumber(data.distance) < "1.0"
                          ? `${roundNumber(data.distance) * 1000} m`
                          : `${roundNumber(data.distance)} km`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ fontFamily: "light", fontSize: 13 }}>
                        Favoritos:
                      </Text>
                      <Text style={{ fontFamily: "regular", fontSize: 14 }}>
                        {post.favorites?.items.length}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{}}>
                  <TouchableOpacity
                    style={[
                      global.bgYellow,
                      {
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 49,
                        marginTop: 10,
                        borderWidth: 0.7,
                        borderColor: "#1f1f1f",
                      },
                    ]}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      navigation.navigate("SearchPost", {
                        data: {
                          item: data,
                          images: list,
                        },
                      });
                    }}
                  >
                    <Text
                      style={[
                        global.black,
                        { fontFamily: "bold", fontSize: 14 },
                      ]}
                    >
                      {`Ver`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default Post;
