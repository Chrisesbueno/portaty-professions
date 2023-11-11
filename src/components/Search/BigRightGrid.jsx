import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import styles from "@/utils/styles/GridSearch.module.css";
import { useNavigation } from "@react-navigation/native";
import Post from "./Post";

const BigRightGrid = ({ data, value }) => {
  const navigation = useNavigation();
  const number = value * 2

  return (
    <View style={{ paddingHorizontal: 10, flexDirection: "row" }}>
      <View style={styles.rightContainer}>
        {data[0] && <Post data={data[0]} image={`https://picsum.photos/id/${number + 1}/200/300`} styled={styles.tinyRightColumn}/>}
        {data[1] && <Post data={data[1]} image={`https://picsum.photos/id/${number + 2}/200/300`} styled={styles.tinyRightColumn}/>}
      </View>
      <View style={styles.bigRightContainer}>
        {data[2] && <Post data={data[2]} image={`https://picsum.photos/id/${number + 3}/200/300`} styled={styles.bigRightColumn}/>}
      </View>
    </View>
  );
};

export default BigRightGrid;
