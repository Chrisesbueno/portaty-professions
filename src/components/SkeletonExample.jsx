import { View, ScrollView } from "react-native";
import React from "react";
import styles from "@/utils/styles/Unprofile.module.css";
import { Skeleton } from "@rneui/themed";
const SkeletonExample = () => {
  const global = require("@/utils/styles/global.js");
  return (
    <View
      style={[
        {
          flex: 1,
        },
        global.bgWhite,
      ]}
    >
      <ScrollView style={{ flex: 1, marginTop: 30 }}>
        <View
          style={[
            {
              flex: 1,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <View
            style={{
              width: 330,
              height: 250,
              borderRadius: 5,
              borderColor: "#efeded",
              borderWidth: 1,
              overflow: "hidden",
              marginBottom: 20,
              marginTop: 20,
            }}
          >
            <Skeleton width={330} height={250} />
            {/* Imagen */}
          </View>
        </View>
        <View
          style={{
            // flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 20,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Favoritos  */}
            <Skeleton width={100} height={60} />
          </View>
          {/* Boton */}
          <Skeleton width={150} height={40} />
        </View>
        <View
          style={[styles.line, global.bgWhiteSmoke, { marginVertical: 10 }]}
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          {/* Mapa */}
          <Skeleton width={330} height={200} />
        </View>

        <View
          style={{
            paddingTop: 10,
            paddingHorizontal: 10,
            alignItems: "center",
          }}
        >
          {/* iconos de compratir etc */}
          <Skeleton width={360} height={80} />
        </View>
        <View
          style={{
            paddingTop: 10,
            paddingHorizontal: 10,
            alignItems: "center",
          }}
        >
          {/* iconos de compratir etc */}
          <Skeleton width={360} height={80} />
        </View>
        <View
          style={{
            paddingTop: 10,
            paddingHorizontal: 10,
            alignItems: "center",
          }}
        >
          {/* iconos de compratir etc */}
          <Skeleton width={360} height={80} />
        </View>
        <View
          style={[styles.line, global.bgWhiteSmoke, { marginVertical: 10 }]}
        />
        <View
          style={{
            marginBottom: 80,
            alignItems: "center",
          }}
        >
          {/* Informacion */}
          <View
            style={{
              marginBottom: 5,
            }}
          >
            <Skeleton width={360} height={20} />
          </View>
          <View style={{ marginBottom: 5 }}>
            <Skeleton width={360} height={20} />
          </View>
          <View style={{ marginBottom: 5 }}>
            <Skeleton width={360} height={20} />
          </View>
          <View style={{ marginBottom: 5 }}>
            <Skeleton width={360} height={20} />
          </View>
          <View style={{ marginBottom: 5 }}>
            <Skeleton width={360} height={20} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SkeletonExample;
