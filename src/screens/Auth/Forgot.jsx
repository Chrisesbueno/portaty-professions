import {
  View,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import styles from "@/utils/styles/Forgot.js";
import { useForm } from "react-hook-form";
import { es } from "@/utils/constants/lenguage";
import { Auth } from "aws-amplify";

const Forgot = ({ navigation, route }) => {
  const global = require("@/utils/styles/global.js");
  const params = route?.params;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      email: params?.email,
    },
  });
  console.log(params);
  const email = watch("email");
  const pwd = watch("password");
  const EMAIL_REGEX = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  const onHandleSendCodeEmail = async (data) => {
    setIsLoading(true);
    setErrorMsg("");
    const { email, password } = data;

    try {
      await Auth.forgotPassword(email);
      const passwordReplace = password.toString().replace(/%/g, "~~pct~~");
      const codificado = encodeURIComponent(passwordReplace);
      navigation.navigate("ConfirmForgot", {
        email: email,
        password: password,
      });
    } catch (error) {
      console.log("ERROR AL ENVIAR CODIGO", error.message);
      switch (error.message) {
        case "Username/client id combination not found.":
          setErrorMsg("Correo no existe como usuario.");
          break;
        case "Attempt limit exceeded, please try after some time.":
          setErrorMsg(
            "Se superó el límite de intentos. Inténtelo después de un tiempo."
          );
          break;
        case "User is disabled.":
          setErrorMsg(
            "Usuario deshabilitado.\nComunicate con soporte Tecnico."
          );
          break;
        default:
          setErrorMsg("Ocurrio un error intente mas tarde.");
          break;
      }
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, global.bgWhite]}
      keyboardVerticalOffset={32}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.content, global.bgWhite]}>
          <ScrollView
            style={[styles.content, global.bgWhite]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{es.authentication.forgot.title}</Text>
            <Text style={{ color: "red" }}>{errorMsg}</Text>
            <View
              style={{
                flex: 1,
              }}
            >
              <CustomInput
                control={control}
                defValue={params?.email ? params?.email : ""}
                name={`email`}
                placeholder={es.authentication.forgot.email.placeholder}
                styled={{
                  text: styles.textInput,
                  label: [styles.labelInput, global.topGray],
                  error: styles.errorInput,
                  placeholder: styles.placeholder,
                  input: [styles.inputContainer, global.bgWhiteSoft],
                }}
                // icon={require("@/utils/images/email.png")}
                text={es.authentication.forgot.email.title}
                rules={{
                  required: "Requerido",
                }}
              />
            </View>

            <Text style={[styles.code, global.topGray]}>
              {es.authentication.forgot.code}{" "}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            <View
              style={{
                flex: 1,
              }}
            >
              <CustomInput
                control={control}
                name={`password`}
                placeholder={es.authentication.forgot.password.placeholder}
                styled={{
                  text: styles.textInput,
                  label: styles.labelInput,
                  error: styles.errorInput,
                  placeholder: styles.placeholder,
                  input: [styles.inputContainer, global.bgWhiteSoft],
                  security: styles.security,
                }}
                text={es.authentication.forgot.password.title}
                // icon={require("@/utils/images/password.png")}
                security={true}
                rules={{
                  required: es.authentication.forgot.password.rules,
                  minLength: {
                    value: 8,
                    message: "Mínimo 8 caracteres",
                  },
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
              }}
            >
              <CustomInput
                control={control}
                name={`password-repeat`}
                placeholder={es.authentication.forgot.repeat.placeholder}
                styled={{
                  text: styles.textInput,
                  label: styles.labelInput,
                  error: styles.errorInput,
                  placeholder: styles.placeholder,
                  input: [styles.inputContainer, global.bgWhiteSoft],
                  security: styles.security,
                }}
                text={es.authentication.forgot.repeat.title}
                // icon={require("@/utils/images/password.png")}
                security={true}
                rules={{
                  required: es.authentication.forgot.repeat.rules,
                  validate: (value) => value == pwd || "No coincide",
                }}
              />
            </View>
          </ScrollView>
          <View style={{ height: 65 }}>
            <CustomButton
              text={
                isLoading ? (
                  <ActivityIndicator color={`#1f1f1f`} />
                ) : (
                  es.authentication.forgot.button
                )
              }
              disabled={isLoading}
              handlePress={handleSubmit(onHandleSendCodeEmail)}
              textStyles={[styles.textContinue, global.black]}
              buttonStyles={[styles.continue, global.bgYellow]}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Forgot;
