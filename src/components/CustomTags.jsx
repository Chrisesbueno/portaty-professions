import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "@/utils/styles/Tags.module.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { es } from "@/utils/constants/lenguage";
import { useRecoilValue } from "recoil";
import { tagsList } from "@/atoms";
import Tag from "./Tag";
import CustomInput from "./CustomInput";

const CustomTags = ({ data }) => {
  const global = require("@/utils/styles/global.js");
  const [modalVisible, setModalVisible] = useState(false);
  const { control } = useForm();
  const tags = useRecoilValue(tagsList);

  useEffect(() => {

  }, []);

  return (
    <ScrollView
      style={[global.bgWhite, { flex: 1 }]}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={styles.labelInputTag}>Tags</Text>
        <TouchableOpacity
          style={[styles.inputContainerTag]}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            {tags.length !== 0 ? (
              tags.map((item, index) => (
                <View key={index} style={styles.containerTag}>
                  <Text style={styles.textTag}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.textInputTag}>Selecciona tus tags</Text>
            )}
          </View>

          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
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
                        width: 25,
                        height: 25,
                        resizeMode: "contain",
                      }}
                      source={require("@/utils/images/arrow_back.png")}
                    />
                  </Pressable>
                  {/* <Text style={styles.modalText}>{`Selecciona tus tags`}</Text> */}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.titleTag}>
                    Tags predeterminados - 10 max
                  </Text>

                  <View style={[{ flex: 1 }]}>
                    <FlatList
                      data={data?.tags?.items}
                      renderItem={({ item }) => <Tag item={item} />}
                      numColumns={3}
                      keyExtractor={(item, index) => index}
                      showsVerticalScrollIndicator={false}
                      columnWrapperStyle={{ justifyContent: "space-between" }}
                    />
                  </View>
                  <View style={[styles.line, global.bgMidGray]} />
                  <CustomInput
                    control={control}
                    name={`personalizado`}
                    placeholder={`Agrega tags personalizados - 3 max`}
                    styled={{
                      text: styles.textInput,
                      label: [styles.labelInput],
                      error: styles.errorInput,
                      input: [styles.inputContainer],
                      placeholder: styles.placeholder,
                    }}
                    // text={`Personalizado`}
                  />
                  <TouchableOpacity
                    style={[
                      global.mainBgColor,
                      {
                        borderRadius: 8,
                        // flex: 1,
                        width: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 49,
                        marginTop: 10,
                      },
                    ]}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text
                      style={[
                        global.white,
                        { fontFamily: "medium", fontSize: 12 },
                      ]}
                    >
                      {`Agregar tag`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CustomTags;
