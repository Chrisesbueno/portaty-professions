import { View, Text, Image } from "react-native";
import React from "react";

const SearchIn = () => {
  const global = require("@/utils/styles/global.js");
  return (
    <View
      style={[
        { flex: 1, paddingHorizontal: 20, paddingTop: 5 },
        global.bgWhite,
      ]}
    >
      <Text
        style={[
          { fontFamily: "bold", fontSize: 18, letterSpacing: -1, marginBottom: 10 },
          global.mainColor,
        ]}
      >
        Recientes
      </Text>
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: "cover",
              marginRight: 5
            }}
            source={require("@/utils/images/search.png")}
          />
          <Text
            style={[{ fontFamily: "light", fontSize: 14 }, global.mainColor]}
          >
            random
          </Text>
        </View>
        <Text
            style={[{ fontFamily: "regular", fontSize: 14 }, global.black]}
          >
            X
          </Text>
      </View>
    </View>
  );
};

export default SearchIn;
