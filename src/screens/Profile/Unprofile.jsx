import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import styles from "@/utils/styles/Unprofile.module.css";
import CustomSelect from "@/components/CustomSelect";
import { settings } from "@/utils/constants/settings";
import { useRecoilValue } from "recoil";
import { Auth, API, Storage } from "aws-amplify";
import * as customProfile from "@/graphql/CustomQueries/Profile";
import * as mutations from "@/graphql/mutations";
import { profileState, userAuthenticated } from "@/atoms";
import * as WebBrowser from "expo-web-browser";
import SkeletonUnprofile from "@/components/SkeletonUnprofile";
import { Skeleton } from "@rneui/themed";
import { useEffect } from "react";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import ModalAlert from "@/components/ModalAlert";
const Unprofile = ({ navigation, route }) => {
  const { buttons } = settings;
  const global = require("@/utils/styles/global.js");
  const [selectKey, setSelectKey] = useState("");
  const userAuth = useRecoilValue(userAuthenticated);
  const [user, setUser] = useState([]);
  const [business, setBusiness] = useState([]);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const status = useRecoilValue(profileState);
  const onHandleLogout = async () => {
    await Auth.signOut();
  };
  const User = async () => {
    const result = await API.graphql({
      query: customProfile.userByEmail,
      authMode: "AMAZON_COGNITO_USER_POOLS",
      variables: {
        email: userAuth?.attributes?.email,
      },
    });
    if (result.data.userByEmail.items[0].business.items.length !== 0)
      setBusiness(result.data.userByEmail.items[0].business.items);
  };

  useEffect(() => {
    setUser([userAuth?.attributes]);
    User();
  }, [status, userAuth]);

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync("https://www.portaty.com");
  };
  if (!user[0]) return <SkeletonUnprofile />;
  return (
    <ScrollView
      style={[styles.container, global.bgWhite]}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={[styles.titleSettings, global.black, { marginTop: 20 }]}>
          {`Perfil`}
        </Text>

        <View style={[styles.line, global.bgWhiteSmoke]} />

        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate("Profile", {
              user: user[0],
            })
          }
        >
          <CustomSelect
            title={`Mi cuenta`}
            subtitle={`Manten actualizado tus datos`}
            styled={{
              text: {
                container: styles.textContainerSelect,
                title: [styles.textTitleSelect, global.black],
                subtitle: [styles.textSubtitleSelect, global.topGray],
              },
              container: styles.containerSelect,
              iconLeft: [styles.iconLeft, global.mainBgColor],
              iconRight: styles.iconRight,
            }}
            icon={{
              left: require("@/utils/images/profile_white.png"),
              right: require("@/utils/images/arrow_right.png"),
            }}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.titleSettings, global.black, { marginTop: 20 }]}>
        {`Gestion`}
      </Text>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (business.length !== 0) {
            setError("Ya tienes un negocio registrado");
            setVisible(true)
          } else {
            navigation.navigate("Form", {
              user: user[0]["custom:userTableID"],
            });
          }
        }}
      >
        <View style={[styles.line, global.bgWhiteSmoke]} />
        <CustomSelect
          title={`Registra un negocio`}
          subtitle={`Publica tu negocio para que cientos de personajes puedan encontrarte`}
          styled={{
            text: {
              container: styles.textContainerSelect,
              title: [styles.textTitleSelect, global.black],
              subtitle: [styles.textSubtitleSelect, global.topGray],
            },
            container: styles.containerSelect,
            iconLeft: [styles.iconLeft, global.mainBgColor],
            iconRight: styles.iconRight,
          }}
          icon={{
            left: require("@/utils/images/product.png"),
            right: require("@/utils/images/arrow_right.png"),
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate("List", {
            data: business,
            user: user[0],
          })
        }
      >
        <View style={[styles.line, global.bgWhiteSmoke]} />
        <CustomSelect
          title={`Lista de tus negocios`}
          subtitle={`Mira todos los negocios que tienes publicados`}
          styled={{
            text: {
              container: styles.textContainerSelect,
              title: [styles.textTitleSelect, global.black],
              subtitle: [styles.textSubtitleSelect, global.topGray],
            },
            container: styles.containerSelect,
            iconLeft: [styles.iconLeft, global.mainBgColor],
            iconRight: styles.iconRight,
          }}
          icon={{
            left: require("@/utils/images/order.png"),
            right: require("@/utils/images/arrow_right.png"),
          }}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={[styles.titleSettings, global.black, { marginTop: 20 }]}>
          {`Configuracion`}
        </Text>
        {buttons.map((button, index) => (
          <View key={index}>
            {button.route ? (
              <TouchableOpacity
                onPress={() => navigation.navigate(button.route)}
              >
                <View style={[styles.line, global.bgWhiteSmoke]} />
                <CustomSelect
                  title={button.title}
                  subtitle={button.subtitle}
                  styled={{
                    text: {
                      container: styles.textContainerSelect,
                      title: [styles.textTitleSelect, global.black],
                      subtitle: [styles.textSubtitleSelect, global.topGray],
                    },
                    container: styles.containerSelect,
                    iconLeft: [styles.iconLeft, global.mainBgColor],
                    iconRight: styles.iconRight,
                  }}
                  icon={button.icon}
                />
              </TouchableOpacity>
            ) : button.web ? (
              <TouchableOpacity onPress={_handlePressButtonAsync}>
                <View style={[styles.line, global.bgWhiteSmoke]} />
                <CustomSelect
                  title={button.title}
                  subtitle={button.subtitle}
                  styled={{
                    text: {
                      container: styles.textContainerSelect,
                      title: [styles.textTitleSelect, global.black],
                      subtitle: [styles.textSubtitleSelect, global.topGray],
                    },
                    container: styles.containerSelect,
                    iconLeft: [styles.iconLeft, global.mainBgColor],
                    iconRight: styles.iconRight,
                  }}
                  icon={button.icon}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onHandleLogout}>
                <View style={[styles.line, global.bgWhiteSmoke]} />
                <CustomSelect
                  title={button.title}
                  subtitle={button.subtitle}
                  styled={{
                    text: {
                      container: styles.textContainerSelect,
                      title: [styles.textTitleSelect, global.black],
                      subtitle: [styles.textSubtitleSelect, global.topGray],
                    },
                    container: styles.containerSelect,
                    iconLeft: [styles.iconLeft, global.mainBgColor],
                    iconRight: styles.iconRight,
                  }}
                  icon={button.icon}
                />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      <ModalAlert
        text={error}
        icon={require("@/utils/images/alert.png")}
        close={() => setVisible(false)}
        open={visible}
      />
    </ScrollView>
  );
};

export default Unprofile;
