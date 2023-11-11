import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { tagsList } from "@/atoms";
import { useRecoilState } from "recoil";
import { useState } from "react";

const Tag = ({ item }) => {
  const global = require("@/utils/styles/global.js");
  const [active, setActive] = useState(false);
  const [selectTagsList, setSelectTagsList] = useRecoilState(tagsList);
  const onHandleCheckActive = () => {
    selectTagsList.map((tag, index) => {
      if (tag === item.tags.name) setActive(true);
    });
  };
  useEffect(() => {
    onHandleCheckActive();
  }, [selectTagsList]);

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
          setSelectTagsList([...selectTagsList, item.tags.name]);
          setActive(true);
        }
        if (active) {
          const tagsFilter = selectTagsList.filter((tag, index) => {
            return selectTagsList.indexOf(item.name) !== index;
          });
          setSelectTagsList(tagsFilter);
          setActive(false);
        }
      }}
    >
      <Text
        style={[
          { fontFamily: active ? "light" : "thin", fontSize: 12 },
          active ? global.white : global.black,
        ]}
      >
        {item.tags.name}
      </Text>
    </TouchableOpacity>
  );
};

export default Tag;
