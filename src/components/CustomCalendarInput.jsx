import { Text, View, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { TextInputMask } from "react-native-masked-text";

const CustomCalendarInput = ({
  defaultValue,
  control,
  name,
  rules = {},
  placeholder,
  styled = {},
  icon,
  text,
  placeholderTextColor = {},
  errorPost = false,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View>
          {text && <Text style={styled.label}>{text}</Text>}
          <View
            style={[
              styled.input,
              (error || errorPost) && { borderColor: "red", borderWidth: 0.5 },
            ]}
          >
            <View style={{ flexDirection: "row" }}>
              {icon && (
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: "contain",
                  }}
                  source={icon}
                />
              )}
              <TextInputMask
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                style={value ? styled.text : styled.placeholder}
                defaultValue={defaultValue}
                type="datetime"
                options={{
                  format: "DD/MM/YYYY",
                }}
                maxLength={10}
              />
            </View>
          </View>
          {error && (
            <Text style={styled.error}>{error.message || "Requerido"}</Text>
          )}
          {errorPost && (
            <Text
              style={{
                color: "red",
                position: "absolute",
                right: 10,
                bottom: -5,
                fontFamily: "medium",
                fontSize: 10,
                textTransform: "capitalize",
              }}
            >
              Requerido
            </Text>
          )}
        </View>
      )}
    />
  );
};

export default CustomCalendarInput;

// const styles = StyleSheet.create({});
