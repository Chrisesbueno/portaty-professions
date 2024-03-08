import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { urlInitalShare } from "@/atoms";
import { useNavigation } from "@react-navigation/native";

const useDeepLinkInital = (checkRender) => {
  const [initalUrl, setInitalUrl] = useRecoilState(urlInitalShare);
  const navigation = useNavigation();

  const returnNavigationScreen = async () => {
    const { path, queryParams } = initalUrl;
    if (path === "share/list" && queryParams?.id) {
      navigation.navigate("ShareNavigator", {
        screen: "ShareListPage",
        params: { id: queryParams?.id },
      });
    }
    if (path === "share/business" && queryParams?.id) {
      navigation.navigate("SharePage", { id: queryParams?.id });
    }
    return setInitalUrl({});
  };

  useEffect(() => {
    if (!checkRender) returnNavigationScreen();
  }, [checkRender]);
};

export default useDeepLinkInital;
