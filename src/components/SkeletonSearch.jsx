import { View, ScrollView, Text } from "react-native";
import React from "react";
import { Skeleton } from "@rneui/themed";
const SkeletonExample = () => {
  const global = require("@/utils/styles/global.js");
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingBottom: 50,
        paddingTop: 10,
        paddingHorizontal: 20,
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 5, paddingHorizontal: 20 }}>
        <View style={{ marginRight: 5 }}>
          <Skeleton width={160} height={150} style={{ marginBottom: 5 }} />
          <Skeleton width={160} height={150} />
        </View>
        <Skeleton width={160} height={305} />
      </View>
      <View style={{ flexDirection: "row-reverse", paddingHorizontal: 20 }}>
        <View style={{ marginLeft: 5 }}>
          <Skeleton width={160} height={150} style={{ marginBottom: 5 }} />
          <Skeleton width={160} height={150} />
        </View>
        <Skeleton width={160} height={305} />
      </View>
    </View>
  );
};

export default SkeletonExample;
