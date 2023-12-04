import { View, Text, Image, Share, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "react-native-qrcode-svg";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import styles from "@/utils/styles/CustomQR.module.css";
import { AntDesign } from "@expo/vector-icons";
import { API } from "aws-amplify";
import ModalAlert from "./ModalAlert";
const CustomQR = ({ route, navigation }) => {
  const global = require("@/utils/styles/global.js");
  const { id, name } = route.params;
  const [file, setFile] = useState(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef();
  const messageText = "Portaty";
  const options = {
    mimeType: "image/jpeg",
    dialogTitle: messageText,
  };

  useEffect(() => {
    ref.current.capture().then((uri) => {
      setFile(uri);
    });
  }, []);
  const onShare = async () => {
    try {
      Sharing.shareAsync(file, options);
    } catch (error) {
      setVisible(true);
      setError(error.message);
    }
  };

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
        path: id,
      },
    };

    try {
      const response = await API.get(api, path);
      console.log(response["pdf_base64"]);

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

  return (
    <View style={[styles.container, global.bgWhite]}>
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontFamily: "light", fontSize: 16 }}>
          Comparte el QR entre todos tus contactos, llevalo donde quieras o
          pegalo en cualquier sitio
        </Text>
      </View>
      <ViewShot
        ref={ref}
        options={{ fileName: "shared", format: "jpg", quality: 0.9 }}
        style={[
          //   { flex: 1, alignContent: "center", justifyContent: "center" },
          global.bgWhite,
        ]}
      >
        <View style={styles.qrContent}>
          <QRCode
            value={id}
            color={"#1f1f1f"}
            backgroundColor={"#ffffff"}
            size={300}
          />
        </View>
        <Text
          style={{
            fontFamily: "lightItalic",
            fontSize: 32,
            textAlign: "center",
            marginTop: -10,
            marginBottom: 10,
          }}
        >
          {name}
        </Text>
      </ViewShot>

      <TouchableOpacity
        style={[styles.input, global.mainBgColor]}
        onPress={onShare}
      >
        <AntDesign name="sharealt" size={24} color="white" />
        <Text style={[styles.textInput, global.white]}>Compartir</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.input, global.mainBgColor, { marginTop: 5 }]}
        onPress={getPdf}
      >
        <AntDesign name="download" size={24} color="white" />
        <Text style={[styles.textInput, global.white]}>Descargar</Text>
      </TouchableOpacity>
      <ModalAlert
        text={error}
        close={() => setVisible(false)}
        open={visible}
        icon={require("@/utils/images/alert.png")}
      />
    </View>
  );
};

export default CustomQR;
