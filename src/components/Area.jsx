import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { areaSelect } from "@/atoms";
import { useRecoilState } from "recoil";
import { useState } from "react";

const Area = ({ item }) => {
  const global = require("@/utils/styles/global.js");
  // const [active, setActive] = useState(false);
  // const [selectActivity, setSelectActivity] = useState("");
  const [selectArea, setSelectArea] = useRecoilState(areaSelect);
  // console.log(item)
  // const onHandleCheckActive = () => {
  //   if (selectArea.activity === selectActivity) {
  //     console.log(selectArea.activity)
  //     console.log(selectActivity)
  //     setActive(true);
  //   } else {
  //     setActive(false);
  //   }
  // };
  useEffect(() => {
    // onHandleCheckActive();
  }, [selectArea]);

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#1f1f1f",
        padding: 10,
        borderRadius: 7,
        marginBottom: 10,
      }}
    >
      <Text
        style={[
          {
            fontFamily: "bold",
            fontSize: 16,
            textTransform: "capitalize",
            marginBottom: 5,
          },
          global.black,
        ]}
      >
        {item.name}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {item.activities?.items?.map((activity, index) => (
          <TouchableOpacity
            key={index}
            style={[
              {
                height: 50,
                width: "48%",
                borderWidth: 1,
                borderColor: "#1f1f1f",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                marginRight: index % 2 === 0 ? "4%" : 0,
              },
              selectArea.activity === activity.name ? global.bgYellow : global.bgWhite,
            ]}
            onPress={() => {
              // if (active === false) {
              setSelectArea({ area: item.name, activity: activity.name });
              // }
            }}
          >
            <Text
              style={[
                {
                  fontFamily: selectArea.activity === activity.name ? "bold" : "medium",
                  fontSize: 12,
                  // textTransform: "capitalize",
                  textAlign: "center",
                },
                global.black,
              ]}
            >
              {activity?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Area;
