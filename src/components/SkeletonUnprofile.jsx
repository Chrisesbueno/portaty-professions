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
        <Text style={[styles.titleSettings, global.black, { marginTop: 20 }]}>
          {`Perfil`}
        </Text>
        <View
          style={[styles.line, global.bgWhiteSmoke, { marginBottom: 10 }]}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              marginRight: 5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Skeleton width={55} height={55} style={{ marginRight: 3 }} />

            <View>
              <Skeleton width={55} height={18} style={{ marginBottom: 1 }} />
              <Skeleton width={180} height={10} />
            </View>
          </View>

          <View>
            <Skeleton width={40} height={20} />
          </View>
        </View>
      </View>

      <View>
        <Text style={[styles.titleSettings, global.black, { marginTop: 20 }]}>
          {`Gestion`}
        </Text>
        <View
          style={[styles.line, global.bgWhiteSmoke, { marginBottom: 10 }]}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              marginRight: 5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Skeleton width={55} height={55} style={{ marginRight: 3 }} />

            <View>
              <Skeleton width={55} height={18} style={{ marginBottom: 1 }} />
              <Skeleton width={180} height={10} />
            </View>
          </View>

          <View>
            <Skeleton width={40} height={20} />
          </View>
        </View>
      </View>

      {/* <View style={[styles.line, global.bgWhiteSmoke]} /> */}
      <View>
        <Text style={[styles.titleSettings, global.black, { marginTop: 20 }]}>
          {`Configuracion`}
        </Text>
        <View
          style={[styles.line, global.bgWhiteSmoke, { marginBottom: 10 }]}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              marginRight: 5,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Skeleton width={55} height={55} style={{ marginRight: 3 }} />

            <View>
              <Skeleton width={55} height={18} style={{ marginBottom: 1 }} />
              <Skeleton width={180} height={10} />
            </View>
          </View>

          <View>
            <Skeleton width={40} height={20} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SkeletonExample;
