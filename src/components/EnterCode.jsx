import { View, TextInput, Text, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import styles from "@/utils/styles/EnterCode.module.css";
import { Controller } from "react-hook-form";

const EnterCode = ({ title, subtitle, control, onResendCode }) => {
  const global = require("@/utils/styles/global.js");

  const one = useRef();
  const two = useRef();
  const three = useRef();
  const four = useRef();
  const five = useRef();
  const six = useRef();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputs}>
          <Controller
            control={control}
            name={"code"}
            render={({ field: { value, onChange } }) => (
              <>
                <TextInput
                  onChangeText={(number) => {
                    let newValue = [...value];
                    newValue[0] = number;
                    onChange(newValue);
                    number && two.current.focus();
                  }}
                  placeholder={`0`}
                  keyboardType="number-pad"
                  maxLength={1}
                  ref={one}
                  style={[styles.input, global.bgWhiteSoft, global.black]}
                />
                <TextInput
                  onChangeText={(number) => {
                    let newValue = [...value];
                    newValue[1] = number;
                    onChange(newValue);
                    number ? three.current.focus() : one.current.focus();
                  }}
                  placeholder={`0`}
                  keyboardType="number-pad"
                  maxLength={1}
                  ref={two}
                  style={[styles.input, global.bgWhiteSoft, global.black]}
                />
                <TextInput
                  onChangeText={(number) => {
                    let newValue = [...value];
                    newValue[2] = number;
                    onChange(newValue);
                    number ? four.current.focus() : two.current.focus();
                  }}
                  placeholder={`0`}
                  keyboardType="number-pad"
                  maxLength={1}
                  ref={three}
                  style={[styles.input, global.bgWhiteSoft, global.black]}
                />
                <TextInput
                  onChangeText={(number) => {
                    let newValue = [...value];
                    newValue[3] = number;
                    onChange(newValue);
                    number ? five.current.focus() : three.current.focus();
                  }}
                  placeholder={`0`}
                  keyboardType="number-pad"
                  maxLength={1}
                  ref={four}
                  style={[styles.input, global.bgWhiteSoft, global.black]}
                />
                <TextInput
                  onChangeText={(number) => {
                    let newValue = [...value];
                    newValue[4] = number;
                    onChange(newValue);
                    number ? six.current.focus() : four.current.focus();
                  }}
                  placeholder={`0`}
                  keyboardType="number-pad"
                  maxLength={1}
                  ref={five}
                  style={[styles.input, global.bgWhiteSoft, global.black]}
                />
                <TextInput
                  onChangeText={(number) => {
                    let newValue = [...value];
                    newValue[5] = number;
                    onChange(newValue);
                    number ? six.current.focus() : five.current.focus();
                  }}
                  placeholder={`0`}
                  keyboardType="number-pad"
                  maxLength={1}
                  ref={six}
                  style={[styles.input, global.bgWhiteSoft, global.black]}
                />
              </>
            )}
          />
        </View>
        {/* <View>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onResendCode}>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </>
  );
};

export default EnterCode;