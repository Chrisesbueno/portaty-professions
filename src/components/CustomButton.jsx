import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  text,
  handlePress,
  textStyles,
  buttonStyles,
  image = {},
  disabled = false
}) => {
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      activeOpacity={1}
      disabled={disabled}
    >
      {text && <Text style={textStyles}>{text}</Text>}
      {image && (
        <Image
          style={{
            width: 25,
            height: 25,
            resizeMode: "contain",
            alignSelf: "center",
          }}
          source={image}
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
