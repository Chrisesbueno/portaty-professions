import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import styles from "@/utils/styles/Mode.module.css";
import ItemList from "./ItemList";

const List = ({ data }) => {
  return (
    <View style={styles.container}>
      {data.map((post, index) => (
        <ItemList key={index} data={post} number={index} styled={{column: styles.columnList}} />
      ))}
    </View>
  );
};

export default List;
