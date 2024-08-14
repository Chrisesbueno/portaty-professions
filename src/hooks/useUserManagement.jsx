import React from "react";
import { Platform } from "react-native";
// amplify
import { Auth, API } from "aws-amplify";
import { userByEmail } from "@/graphql/CustomQueries/Navigation";
import { updateUsers } from "@/graphql/CustomMutations/Navigation";
// recpil
import { useRecoilState } from "recoil";
import { userAuthenticated, userTable } from "@/atoms/index";
import { useNavigation } from "@react-navigation/native";
// functions
import { registerEvent } from "@/functions/Analytics";
const useUserManagement = () => {
  const [userAuth, setUserAuth] = useRecoilState(userAuthenticated);

  const userSignIn = async (data) => {
    try {
      const result = await Auth.currentAuthenticatedUser();
      setUserAuth(result);
      checkAttributes(result);
      const { attributes } = result;
      const params = {
        type: "signIn",
        userid: attributes["custom:userTableID"],
        birthdate: attributes?.birthdate,
        gender: attributes["custom:gender"],
      };
      registerEvent("user_auth", params);
    } catch (error) {
      setUserAuth(null);
    }
  };

  const userSignOut = async (data) => {
    const { attributes } = data;
    const params = {
      type: "signOut",
      userid: attributes["custom:userTableID"],
      birthdate: attributes?.birthdate,
      gender: attributes["custom:gender"],
    };
    registerEvent("user_auth", params);
    setUserAuth(null);
  };
  const checkUser = async () => {
    try {
      const data = await Auth.currentAuthenticatedUser();
      setUserAuth(data);
      checkAttributes(data);
      // navigation.navigate("Tabs_Navigation");
    } catch (error) {
      const { message } = new Error(error);
      console.log("ERROR USER: ", message);
      setUserAuth(null);
    }
  };

  const checkAttributes = async (data) => {
    const { attributes } = data;
    if (
      !attributes["custom:userTableID"] ||
      attributes["custom:userTableID"] === ""
    )
      updateUserTableID(data);
    if (
      !attributes["custom:identityID"] ||
      attributes["custom:identityID"] === ""
    ) {
      const { identityId } = await Auth.currentUserCredentials();
      await updateIdentityID(data, identityId);
      await updateTableIdentityID(data, identityId);
    }
  };

  const updateTableIdentityID = async (data, identityId) => {
    const { attributes } = data;
    try {
      await API.graphql({
        query: updateUsers,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          input: {
            id: attributes["custom:userTableID"],
            identityID: identityId,
          },
        },
      });
    } catch (error) {
      console.log("ERROR AL ACTUALZIAR TABLA EN IDENTITYID", error);
    }
  };
  const updateIdentityID = async (data, identityId) => {
    try {
      await Auth.updateUserAttributes(data, {
        "custom:identityID": identityId,
      });
    } catch (error) {
      const { message } = new Error(error);
      console.log("ERROR AL ACTUALIZAR ATRIBUTO IDENTITY ID: ", message);
    }
  };
  const updateUserTableID = async (data) => {
    const { email } = data.attributes;
    try {
      const result = await API.graphql({
        query: userByEmail,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          email,
        },
      });
      await Auth.updateUserAttributes(data, {
        "custom:userTableID": result.data.userByEmail.items[0].id,
      });
    } catch (error) {
      const { message } = new Error(error);
      console.log("ERROR AL CATUALIZAR USER TABLE ID", message);
    }
  };

  return { checkUser, userSignIn, userSignOut };
};

export default useUserManagement;