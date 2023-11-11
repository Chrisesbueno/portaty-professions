import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import styles from "@/utils/styles/GridSearch.module.css";
import { useNavigation } from "@react-navigation/native";
import Post from "./Post";

const RightGrid = ({ data, value }) => {
  const navigation = useNavigation();
  const number = value * 2
  return (
    <View style={{ paddingHorizontal: 10, flexDirection: 'row'}}>
      <View style={styles.rightGridContainer}>
      {data[0] && <Post data={data[0]} image={`https://picsum.photos/id/${number + 1}/200/300`} styled={styles.column}/>}
        {data[1] && <Post data={data[1]} image={`https://picsum.photos/id/${number + 2}/200/300`} styled={styles.column}/>}
        {data[2] && <Post data={data[2]} image={`https://picsum.photos/id/${number + 3}/200/300`} styled={styles.column}/>}
        {data[3] && <Post data={data[3]} image={`https://picsum.photos/id/${number + 4}/200/300`} styled={styles.column}/>}
      </View>
      <View style={styles.bigContainer}>
      {data[4] && <Post data={data[4]} image={`https://picsum.photos/id/${number + 5}/200/300`} styled={styles.bigColumn}/>}
      </View>
    </View>
  );
};

export default RightGrid;
