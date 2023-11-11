import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "@/utils/styles/GridProfile.module.css";
import { useNavigation } from "@react-navigation/native";
import LeftGrid from "./LeftGrid";
import BigRightGrid from "./BigRightGrid";
import BigLeftGrid from "./BigLeftGrid";
import RightGrid from "./RigthGrid";
import { Auth, API, Storage } from "aws-amplify";
import * as queries from "@/graphql/CustomQueries/Favorites";

const GridSearch = ({ renderItems, more }) => {
  // const [newRenderItems, setNewRenderItems] = useState([]);
  // const fetchFavorites = () => {
  //   let temporalItems = [];

  //   renderItems.map(async (item, index) => {
  //     try {
  //       const result = await API.graphql({
  //         query: queries.favoritesByBusinessID,
  //         authMode: "AMAZON_COGNITO_USER_POOLS",
  //         variables: {
  //           businessID: item.id,
  //         },
  //       });
  //       if (result.data.favoritesByBusinessID.items.length !== 0) {
  //         temporalItems.push({ favorite: true, item: item });
  //       } else {
  //         temporalItems.push({ favorite: false, item: item });
  //       }
  //       setNewRenderItems(temporalItems);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   fetchFavorites();
  //   console.log(newRenderItems.length >= renderItems.length)
  // }, []);

  if (renderItems.length !== 0) 
    return (
      <View style={{ flex: 1 }}>
        <BigLeftGrid data={renderItems.slice(0, 3)} value={more + 15} />
        {renderItems.length >= 4 && (
          <RightGrid
            data={renderItems.slice(
              3,
              renderItems.length - 1 < 7 ? renderItems.length - 1 : 8
            )}
            value={more + 20}
          />
        )}
        {renderItems.length >= 9 && (
          <LeftGrid
            data={renderItems.slice(
              8,
              renderItems.length - 1 < 12 ? renderItems.length - 1 : 13
            )}
            value={more + 25}
          />
        )}
        {renderItems.length >= 14 && (
          <BigRightGrid
            data={renderItems.slice(
              13,
              renderItems.length - 1 < 15 ? renderItems.length - 1 : 16
            )}
            value={more + 30}
          />
        )}
        {renderItems.length >= 17 && (
          <LeftGrid
            data={renderItems.slice(
              16,
              renderItems.length - 1 < 20 ? renderItems.length - 1 : 21
            )}
            value={more + 35}
          />
        )}
        {renderItems.length >= 22 && (
          <RightGrid
            data={renderItems.slice(
              21,
              renderItems.length - 1 < 25 ? renderItems.length - 1 : 26
            )}
            value={more + 40}
          />
        )}
      </View>
    );
  
};

export default GridSearch;
