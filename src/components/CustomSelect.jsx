import { Image, View } from "react-native";
import React from "react";
import CustomText from "./CustomText";

const CustomSelect = ({
  title,
  subtitle,
  styled = {},
  icon = { left: {}, right: {} },
}) => {
  return (
    <View style={styled.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styled.iconLeft}>
          {icon.left && (
            <Image
              style={{
                width: 30,
                height: 30,
                resizeMode: "contain",
                alignSelf: "center",
              }}
              source={icon.left}
            />
          )}
        </View>
        <CustomText title={title} subtitle={subtitle} styled={styled.text} />
      </View>

      {icon.right && (
        <View style={styled.iconRight}>
          <Image
            style={{
              width: 40,
              height: 45,
              resizeMode: "contain",
              alignSelf: "center",
            }}
            source={icon.right}
          />
        </View>
      )}
    </View>
  );
};

export default CustomSelect;