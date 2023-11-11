import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { activitySelect, tagsList } from "@/atoms";
import { useRecoilState } from "recoil";
import { useState } from "react";

const Activity = ({ item }) => {
  const global = require("@/utils/styles/global.js");
  const [active, setActive] = useState(false);
  const [selectActivity, setSelectActivity] = useRecoilState(activitySelect);
  const onHandleCheckActive = () => {
      if (selectActivity.id === item.id) {
        setActive(true)
    } else {
        setActive(false)
    }
  };
  useEffect(() => {
    onHandleCheckActive()
  }, [selectActivity]);

  return (
    <TouchableOpacity
      style={[
        {
          height: 50,
          width: 80,
          borderWidth: 0.5,
          borderColor: "#444",
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        },
        active && global.mainBgColor,
      ]}
      onPress={() => {
        if (active === false) {
            setSelectActivity(item);
          setActive(true);
        }
      }}
    >
      <Text
        style={[
          { fontFamily: active ? "light" : "thin", fontSize: 12 },
          active ? global.white : global.black,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default Activity;
