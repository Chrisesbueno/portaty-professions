import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import styles from "@/utils/styles/GridSearch.module.css";
import { useNavigation } from "@react-navigation/native";
import Post from "./Post";

const BigLeftGrid = ({ data, value }) => {
  const navigation = useNavigation();
  const number = value * 2;
  return (
    <View style={{ paddingHorizontal: 10, flexDirection: "row" }}>
      <View style={styles.bigLeftContainer}>
        {data[0] && (
          <Post
            data={data[0]}
            image={`https://picsum.photos/id/${number + 1}/200/300`}
            styled={styles.bigLeftColumn}
          />
        )}
      </View>
      <View style={styles.leftContainer}>
        {data[1] && (
          <Post
            data={data[1]}
            image={`https://picsum.photos/id/${number + 2}/200/300`}
            styled={styles.tinyLeftColumn}
          />
        )}
        {data[2] && (
          <Post
            data={data[2]}
            image={`https://picsum.photos/id/${number + 3}/200/300`}
            styled={styles.tinyLeftColumn}
          />
        )}
      </View>
    </View>
  );
};

export default BigLeftGrid;
