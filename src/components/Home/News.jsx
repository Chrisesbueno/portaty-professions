import { View, Text } from "react-native";
import React from "react";
import ItemNew from "./ItemNew";

const News = ({ data }) => {
  console.log(data[0].business.images);
  let listImages = [];
  let listImagesOrden = [];
  data.forEach((item) => {
    if (item.business.images.length !== 0) {
      item.business.images.forEach((imagen) => {
        listImages.push(JSON.parse(imagen));
      });
    }
  });
  listImagesOrden = listImages.sort(
    (a, b) =>  new Date(b.date) - new Date(a.date)
  );

  console.log("desde la lista ordenada",listImagesOrden);
  console.log("desde la lista", listImages);
  return (
    <View>
      {listImagesOrden.map((item, index) => (
        <ItemNew data={item} key={index} page={data} />
      ))}
    </View>
  );
};

export default News;
