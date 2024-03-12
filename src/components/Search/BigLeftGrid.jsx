import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import styles from "@/utils/styles/GridSearch.module.css";
import Post from "./Post";

const BigLeftGrid = ({ data, input }) => {
  console.log('bigleft', input)

  return (
    <View style={{ paddingHorizontal: 10, flexDirection: "row" }}>
      <View style={styles.bigLeftContainer}>
        {data[0] && (
          <Post
            input={input}
            data={data[0]}
            image={data[0].thumbnail}
            styled={styles.bigLeftColumn}
          />
        )}
      </View>
      <View style={styles.leftContainer}>
        {data[1] && (
          <Post
            input={input}
            data={data[1]}
            image={data[1].thumbnail}
            styled={styles.tinyLeftColumn}
          />
        )}
        {data[2] && (
          <Post
            input={input}
            data={data[2]}
            image={data[2].thumbnail}
            styled={styles.tinyLeftColumn}
          />
        )}
      </View>
    </View>
  );
};

export default BigLeftGrid;
