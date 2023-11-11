import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "@/utils/styles/Confirm.module.css";
import EnterCode from "@/components/EnterCode";
import CustomButton from "@/components/CustomButton";
import { es } from "@/utils/constants/lenguage";
import { Auth } from "aws-amplify";
import CustomCodeField from "@/components/CustomCodeField";
import { useRecoilState } from "recoil";
import { codeFields } from "@/atoms";

const ConfirmForgot = ({ navigation, route }) => {
  const global = require("@/utils/styles/global.js");
  const [time, setTime] = useState(10 * 60); // 10 minutos
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [codeSend, setCodeSend] = useState("");
  const [errorSendCode, setErrorSendCode] = useState("");
  const { email, password } = route.params;
  const [codeInputs, setCodeInputs] = useRecoilState(codeFields);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: email,
      password: password,
    },
  });
  const onHandleConfirmCodeNewPassword = async (data) => {
    setErrorMsg("");
    setCodeSend("");
    setErrorSendCode("");
    setIsLoading(true);
    const { email, password } = data;
    try {
      await Auth.forgotPasswordSubmit(email, codeInputs, password);
      navigation.navigate("Login");
    } catch (error) {
      switch (error.message) {
        case "Invalid verification code provided, please try again.":
          setErrorMsg(
            `Se proporcionó un código de verificación no válido (${codeInputs}). Inténtelo de nuevo.`
          );
          break;
        case "Attempt limit exceeded, please try after some time.":
          setErrorMsg(
            `Se superó el límite de intentos. Inténtelo después de un tiempo.`
          );
          break;
        default:
          setErrorMsg("Ocurrio un error, Intente de nuevo.");
          break;
      }
      console.log("ERROR AL CONFIRMAR CODIGO: ", error.message);
      setIsLoading(false);
    }
  };

  const onHandleResendCode = async () => {
    setErrorMsg("");
    setCodeSend("");
    setErrorSendCode("");
    try {
      const result = await Auth.forgotPassword(email);
      console.log("Envio de Codigo: ", result);
      setCodeSend(
        `Codigo enviado a ${result?.CodeDeliveryDetails?.Destination}`
      );
    } catch (error) {
      console.log("ERROR AL ENVIAR MENSAJE: ", error.message);
      switch (error.message) {
        case "Attempt limit exceeded, please try after some time.":
          setErrorSendCode(
            `Se superó el límite de intentos. Inténtelo después de un tiempo.`
          );
          break;

        default:
          setErrorSendCode("Ocurrio un error, Intente de nuevo.");
          break;
      }
    }
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [time]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, global.bgWhite]}
      keyboardVerticalOffset={32}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.content, global.bgWhite]}>
          <ScrollView
            style={[styles.scroll, global.bgWhite]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{es.authentication.forgot.title}</Text>
            <Text style={{ fontFamily: "light", fontSize: 16 }}>
              Enviamos el codigo de confirmacion a {email}
            </Text>
            <Text style={{ color: "red" }}>{errorMsg}</Text>
              <Text style={[{ fontSize: 16, fontFamily: 'light', marginTop: 10 }]}>{`Tu codigo expirara en: ${formatTime(time)} introducelo antes`}</Text>
            <CustomCodeField />
            <View style={{ marginTop: 10 }}>
              <Text style={styles.titleAlert}>
                {es.authentication.account.code.title}
              </Text>
              <TouchableOpacity onPress={onHandleResendCode}>
                <Text style={styles.subtitleAlert}>
                  {es.authentication.account.code.subtitle}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "green" }}>{codeSend}</Text>
            <Text style={{ color: "red" }}>{errorSendCode}</Text>
          </ScrollView>
          <View style={{ height: 60 }}>
            <CustomButton
              text={isLoading ? <ActivityIndicator color={`#ffffff`}/> : `Confirmar contraseña`}
              disabled={isLoading}
              handlePress={handleSubmit(onHandleConfirmCodeNewPassword)}
              textStyles={[styles.textContinue, global.white]}
              buttonStyles={[styles.continue, global.mainBgColor]}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ConfirmForgot;