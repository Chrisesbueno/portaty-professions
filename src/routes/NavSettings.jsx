import { useEffect } from "react";
import { Hub } from "aws-amplify";
import { useUserManagement } from "@/hooks";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";
// recoil
import { useSetRecoilState } from "recoil";
import { urlInitalShare } from "@/atoms";
import useDeepLinkInital from "@/hooks/useDeepLinkInital";
const NavSettings = ({ checkRender }) => {
  const setUrlInitialShare = useSetRecoilState(urlInitalShare);
  const { userSignIn, userSignOut, checkUser } = useUserManagement();
  const navigation = useNavigation();
  useDeepLinkInital(checkRender);
  useEffect(() => {
    // crear subscripcion
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      console.log("HUB: ", event);
      switch (event) {
        case "signIn":
          userSignIn(data);
          break;
        case "signOut":
          userSignOut();
          break;
        case "confirmSignUp":
          break;
        case "autoSignIn":
          break;
        case "updateUserAttributes":
          checkUser();
          break;
      }
    });

    // Verifica si la aplicación se está abriendo mediante un deep link al iniciar
    const checkInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (!initialUrl) return;
      const { hostname, path, queryParams } = Linking.parse(initialUrl);
      if (initialUrl) {
        // La aplicación se abrió mediante un deep link, puedes realizar acciones aquí
        console.log(
          "La aplicación se abrió mediante el deep link (primer plano):",
          initialUrl,
          { hostname, path, queryParams }
        );
        setUrlInitialShare({
          path,
          queryParams,
        });
      }
    };
    Linking.addEventListener("url", ({ url }) => {
      const { hostname, path, queryParams } = Linking.parse(url);
      if (url) {
        console.log("La aplicación se abrió en segundo plano:", url, {
          hostname,
          path,
          queryParams,
        });
        if (path === "share/list" && queryParams?.id) {
          return navigation.navigate("ShareNavigator", {
            screen: "ShareListPage",
            params: { id: queryParams?.id },
          });
        }
        if (path === "share/business" && queryParams?.id) {
          return navigation.navigate("SharePage", { id: queryParams?.id });
        }
      }
    });
    checkInitialUrl();
    checkUser();
    return () => {
      unsubscribe;
    };
  }, []);
};

export default NavSettings;
