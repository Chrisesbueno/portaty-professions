import { View, Text } from "react-native";
import React from "react";
import styles from "@/utils/styles/Mode.module.css";
import ItemProfile from "@/components/ItemProfile";
import CustomButton from "@/components/CustomButton";

const List = ({ route, navigation }) => {
  const { data, user } = route.params;
  const global = require("@/utils/styles/global.js");
  console.log(user);
  if (data.length !== 0)
    return (
      <View
        style={[
          { flex: 1, paddingHorizontal: 10, paddingTop: 40 },
          global.bgWhite,
        ]}
      >
        {data.map((post, index) => (
          <ItemProfile
            key={index}
            data={post}
            identityID={user["custom:identityID"]}
            styled={{ column: styles.columnList }}
          />
        ))}
      </View>
    );
  if (data.length === 0)
    return (
      <View
        style={[
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 70,
          },
          global.bgWhite,
        ]}
      >
        <Text style={{ fontFamily: "light", fontSize: 16 }}>
          No tienes ningun negocio registrado
        </Text>
        <CustomButton
          text={`Registrar un negocio`}
          handlePress={() =>
            navigation.navigate("Form", {
              user: user["custom:userTableID"],
            })
          }
          textStyles={[styles.textSearch, global.white]}
          buttonStyles={[styles.search, global.mainBgColor]}
        />
      </View>
    );
};

export default List;
