import { View, ScrollView, Text } from "react-native";
import React from "react";
import styles from "@/utils/styles/Unprofile.module.css";
import { Skeleton } from "@rneui/themed";
const SkeletonExample = () => {
  const global = require("@/utils/styles/global.js");
  return (
    <ScrollView
      style={[styles.container, global.bgWhite]}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginTop: 25
          }}
        >
          <Skeleton width={300} height={85} style={{marginVertical: 10, borderRadius: 8}} />
          <Skeleton width={300} height={85} style={{marginVertical: 10, borderRadius: 8}} />
          <Skeleton width={300} height={85} style={{marginVertical: 10, borderRadius: 8}} />
          <Skeleton width={300} height={85} style={{marginVertical: 10, borderRadius: 8}} />
          <Skeleton width={300} height={85} style={{marginVertical: 10, borderRadius: 8}} />
          <Skeleton width={300} height={85} style={{marginVertical: 10, borderRadius: 8}} />
        </View>
      </View>
    </ScrollView>
  );
};

export default SkeletonExample;
