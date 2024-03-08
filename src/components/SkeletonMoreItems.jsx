import { View, ScrollView } from "react-native";
import React from "react";
import { Skeleton } from "@rneui/themed";

const SkeletonExample = () => {
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: 50,
        }}
      >
        <Skeleton circle width={10} height={10} />
        <Skeleton circle width={10} height={10} />
        <Skeleton circle width={10} height={10} />
      </View>
    </View>
  );
};

export default SkeletonExample;
