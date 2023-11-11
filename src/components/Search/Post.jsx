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
import { FontAwesome } from "@expo/vector-icons";

const Post = ({ data, image, styled }) => {
  const global = require("@/utils/styles/global.js");
  const navigation = useNavigation();
  const [post, setPost] = useState([]);
  const [selectKey, setSelectKey] = useState("");
  const [loading, setLoading] = useState(false);
  // console.log(data)
  const [modalVisible, setModalVisible] = useState(false);
  const getImage = async () => {
    setLoading(true);
    try {
      await Storage.get(data.path, {
        level: "protected",
        identityId: data.identityID,
      }).then((res) => setSelectKey(res));
      setLoading(false);
    } catch (error) {
      console.log("toy en post", error);
    }
  };
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
    if (!selectKey) getImage();
    console.log(data.distance);
  }, []);
  if (selectKey)
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
          {!selectKey ? (
            <ActivityIndicator size={`large`} color={`#fb8500`} />
          ) : (
            <View style={{ height: "100%", width: "100%" }}>
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                  borderRadius: 2,
                }}
                source={{ uri: selectKey }}
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
          )}
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
                      }}
                      source={{ uri: selectKey }}
                    />
                    <View style={{ paddingVertical: 15 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 5,
                        }}
                      >
                        <Text style={{ fontFamily: "light", fontSize: 14 }}>
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
                        <Text style={{ fontFamily: "light", fontSize: 14 }}>
                          Actividad:
                        </Text>
                        <Text style={{ fontFamily: "regular", fontSize: 14 }}>
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
                        <Text style={{ fontFamily: "light", fontSize: 14 }}>
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
                        <Text style={{ fontFamily: "light", fontSize: 14 }}>
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
                        global.mainBgColor,
                        {
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 49,
                          marginTop: 10,
                        },
                      ]}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                        navigation.navigate("SearchPost", {
                          data: {
                            item: data,
                            image: selectKey,
                          },
                        });
                      }}
                    >
                      <Text
                        style={[
                          global.white,
                          { fontFamily: "medium", fontSize: 14 },
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
