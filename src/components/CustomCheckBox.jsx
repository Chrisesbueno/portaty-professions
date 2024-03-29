import { StyleSheet, Text, View, Linking } from "react-native";
import React from "react";
import Checkbox from "expo-checkbox";
import { Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
const CustomCheckBox = ({
  control,
  rules = {},
  text = "",
  name,
  onPressed,
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
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Checkbox
              style={{ marginVertical: 10, width: 18, height: 18 }}
              value={value}
              onValueChange={onChange}
              color={ error ? "red" : value ? "#ffb703" : undefined}
            />
            <Text style={{ marginHorizontal: 5, fontFamily: 'regular', fontSize: 13 }}>{text}</Text>
            {onPressed && (
              <Feather
                name="external-link"
                size={18}
                color="#ffb703"
                onPress={onPressed}
              />
            )}
          </View>
          {error && (
            <Text style={{ color: "red", fontFamily: 'bold', fontSize: 12, marginTop: -20, marginBottom: 10 }}>{error.message || "Error"}</Text>
          )}
        </>
      )}
    />
  );
};

export default CustomCheckBox;

const styles = StyleSheet.create({});
