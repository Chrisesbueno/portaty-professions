import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { urlInitalShare } from "@/atoms";
import { useNavigation } from "@react-navigation/native";

const useDeepLinkInital = (checkRender) => {
  const [initalUrl, setInitalUrl] = useRecoilState(urlInitalShare);
  const navigation = useNavigation();

  const returnNavigationScreen = async () => {
    console.log(initalUrl);
    const { path, queryParams } = initalUrl;
    if (path === "share/list" && queryParams?.id) {
      console.log("TE VAS OARA SHARE/LIST", initalUrl);
      navigation.navigate("ShareNavigator", {
        screen: "ShareListPage",
        params: { id: queryParams?.id },
      });
    }
    if (path === "share/business" && queryParams?.id) {
      console.log("TE VAS PARA SHARE/BUSINESS", initalUrl);
      navigation.navigate("SharePage", { id: queryParams?.id });
    }
    return setInitalUrl({});
  };

  useEffect(() => {
    console.log("se disparo return ", checkRender);
    if (!checkRender) returnNavigationScreen();
  }, [checkRender]);
};

export default useDeepLinkInital;
