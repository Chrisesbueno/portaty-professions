import {
  View,
  ScrollView,
  Text as RNText,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Grid,
  YAxis,
  XAxis,
  PieChart,
} from "react-native-svg-charts";
import { Circle, G, Line, Text } from "react-native-svg";
// amplify
import { API } from "aws-amplify";

const likesData = {
  "2024-02-01": 100,
  "2024-02-02": 120,
  "2024-02-03": 90,
  "2024-02-04": 150,
  "2024-02-05": 150,
  "2024-02-06": 110,
  "2024-02-09": 180,
};
const days = Object.keys(likesData);
const likes = Object.values(likesData);

const dataGender = [
  {
    key: 1,
    value: 50,
    svg: { fill: "#ffb703" },
    arc: { outerRadius: "120%", cornerRadius: 10 },
    label: "Hombre",
    amount: 75,
  },
  {
    key: 2,
    value: 30,
    svg: { fill: "#FFFA15" },
    label: "Mujer",
    amount: 45,
  },
  {
    key: 3,
    value: 20,
    svg: { fill: "#b28002" },
    label: "Otro",
    amount: 25,
  },
];

const dataAge = [
  {
    key: 1,
    value: 10,
    svg: { fill: "#ffb703" },
    label: "14-20",
    amount: 25,
  },
  {
    key: 2,
    value: 45,
    svg: { fill: "#FFFA15" },
    arc: { outerRadius: "120%", cornerRadius: 10 },
    label: "21-30",
    amount: 55,
  },
  {
    key: 3,
    value: 25,
    svg: { fill: "#b28002" },
    label: "31-40",
    amount: 40,
  },
  {
    key: 4,
    value: 10,
    svg: { fill: "#D6D211" },
    label: "41-50",
    amount: 25,
  },
  {
    key: 5,
    value: 10,
    svg: { fill: "#FFD700" },
    label: "51 o mas",
    amount: 25,
  },
];

const dataLocation = [
  {
    key: 1,
    value: 25,
    svg: { fill: "#ffb703" },
    label: "Cabudare",
    amount: 31,
  },
  {
    key: 2,
    value: 5,
    svg: { fill: "#FFFA15" },
    label: "Carora",
    amount: 13,
  },
  {
    key: 3,
    value: 15,
    svg: { fill: "#b28002" },
    label: "Guanare",
    amount: 5,
  },
  {
    key: 4,
    value: 45,
    amount: 58,
    svg: { fill: "#D6D211" },
    arc: { outerRadius: "120%", cornerRadius: 10 },
    label: "Barquisimeto",
  },
  {
    key: 5,
    value: 10,
    amount: 25,
    svg: { fill: "#FFD700" },
    label: "Maracaibo",
  },
];

const dataResumen = [
  {
    fecha: "2024-02-01",
    nombre: "Juan",
    ubicacion: "Caracas",
    sexo: "Hombre",
    edad: 30,
    id: "1",
  },
  {
    fecha: "2024-02-02",
    nombre: "María",
    ubicacion: "Maracaibo",
    sexo: "Mujer",
    edad: 25,
    id: "2",
  },
  {
    fecha: "2024-02-02",
    nombre: "María",
    ubicacion: "Maracaibo",
    sexo: "Mujer",
    edad: 27,
    id: "3",
  },
  {
    fecha: "2024-02-02",
    nombre: "María",
    ubicacion: "Maracaibo",
    sexo: "Mujer",
    edad: 23,
    id: "4",
  },
  {
    fecha: "2024-02-02",
    nombre: "María",
    ubicacion: "Maracaibo",
    sexo: "Mujer",
    edad: 21,
    id: "5",
  },
];

const buttons = [
  {
    id: 1,
    value: "Favoritos: Nuevos",
  },
  {
    id: 2,
    value: "Favoritos: Perdidos",
  },
  {
    id: 3,
    value: "Visitas",
  },
];

const Labels = ({ slices }) => {
  return slices.map((slice, index) => {
    const { labelCentroid, data } = slice;
    return (
      <Text
        key={index}
        x={labelCentroid[0]}
        y={labelCentroid[1]}
        fill="#1f1f1f"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={10}
        fontWeight={700}
      >
        {`${data.amount}`}
      </Text>
    );
  });
};

const Decorator = ({ x, y }) => {
  return likes.map((value, index) => (
    <G key={index}>
      <Line
        x1={x(index)}
        y1={y(value)}
        x2={x(index)}
        y2={y(0)}
        stroke="grey"
        strokeDasharray={[5, 5]}
      />
      <Circle
        cx={x(index)}
        cy={y(value)}
        r={4}
        stroke="rgb(31, 31, 31)"
        fill="#1f1f1f"
      />
      <Text
        x={x(index)}
        y={y(value) - 10}
        fontSize={10}
        fill="black"
        alignmentBaseline="middle"
        textAnchor="middle"
        fontFamily="bold"
      >
        {value}
      </Text>
    </G>
  ));
};

const Analytics = ({ route }) => {
  const [type, setType] = useState(1);
  const [timeGraph, setTimeGraph] = useState(1);
  const maxValue = Math.max(...likes);

  const getData = async () => {
    const api = "api-portaty";
    const path = "/athena/example";
    const params = {
      headers: {},
      queryStringParameters: {
        businessID: "95c3e6c3-c4ac-468e-8140-2061318d3370",
      },
    };
    try {
      const response = await API.get(api, path, params);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <ScrollView horizontal style={{ marginTop: 40, paddingHorizontal: 10 }}>
        {buttons.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: 80,
              height: 80,
              marginRight: 5,
              borderWidth: 1,
              borderColor: "#1f1f1f",
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: item.id === type ? "#ffb703" : "#ffffff",
            }}
            onPress={() => setType(item.id)}
          >
            <RNText style={{ fontFamily: "bold", fontSize: 12 }}>
              {item.value}
            </RNText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View
        style={{
          padding: 10,
          marginBottom: 70,
        }}
      >
        <View
          style={{
            borderColor: "#1f1f1f",
            borderWidth: 0.7,
            borderRadius: 5,
            padding: 10,
            marginTop: 10,
            flex: 1,
          }}
        >
          <RNText
            style={{
              fontFamily: "bold",
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            Grafico de nuevos favoritos
          </RNText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#1f1f1f",
                paddingHorizontal: 7,
                paddingVertical: 3,
                borderRadius: 5,
                backgroundColor: timeGraph === 1 ? "#ffb703" : "#ffffff",
              }}
              onPress={() => setTimeGraph(1)}
            >
              <RNText
                style={{
                  fontFamily: "bold",
                  fontSize: 13,
                }}
              >
                7 días
              </RNText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#1f1f1f",
                paddingHorizontal: 7,
                paddingVertical: 3,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor: timeGraph === 2 ? "#ffb703" : "#ffffff",
              }}
              onPress={() => setTimeGraph(2)}
            >
              <RNText
                style={{
                  fontFamily: "regular",
                  fontSize: 13,
                }}
              >
                30 días
              </RNText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#1f1f1f",
                paddingHorizontal: 7,
                paddingVertical: 3,
                borderRadius: 5,
                backgroundColor: timeGraph === 3 ? "#ffb703" : "#ffffff",
              }}
              onPress={() => setTimeGraph(3)}
            >
              <RNText
                style={{
                  fontFamily: "regular",
                  fontSize: 13,
                }}
              >
                1 año
              </RNText>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 230,
              flexDirection: "row",
            }}
          >
            <YAxis
              data={likes}
              contentInset={{ top: 25, bottom: 30 }}
              svg={{
                fill: "grey",
                fontSize: 9,
              }}
              numberOfTicks={10}
              formatLabel={(value) => `${value}`}
              min={0}
              max={maxValue}
              style={{
                marginRight: 3,
              }}
            />
            <ScrollView horizontal>
              <View style={{ width: days.length * 60 }}>
                <LineChart
                  style={{ flex: 1 }}
                  data={likes}
                  svg={{ stroke: "rgb(255, 183, 3)" }}
                  contentInset={{ top: 25, bottom: 0, left: 20, right: 20 }}
                  yMin={0}
                >
                  <Grid />
                  <Decorator data={likes} />
                </LineChart>
                <XAxis
                  style={{ marginHorizontal: -10, height: 15, marginTop: 15 }}
                  data={days}
                  formatLabel={(value, index) => days[index].substring(5)}
                  contentInset={{ left: 30, right: 30 }}
                  svg={{ fontSize: 11, fill: "black", fontFamily: "regular" }}
                />
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <RNText
              style={{
                fontSize: 12,
                fontFamily: "lightItalic",
              }}
            >
              mover para más
            </RNText>
            <Image
              style={{
                width: 30,
                height: 30,
                resizeMode: "cover",
              }}
              source={require("@/utils/images/arrow_right.png")}
            />
          </View>
        </View>

        <View
          style={{
            borderColor: "#1f1f1f",
            borderWidth: 0.7,
            borderRadius: 5,
            padding: 10,
            marginTop: 15,
          }}
        >
          <RNText style={{ fontFamily: "bold", fontSize: 14, marginTop: 5 }}>
            Nuevos favoritos: diagrama de genero
          </RNText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <PieChart
              style={{ width: 150, height: 170 }}
              data={dataGender}
              outerRadius={"70%"}
              innerRadius={1}
            >
              <Labels />
            </PieChart>
            <View>
              {dataGender.map((entry, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: entry.svg.fill,
                      height: 15,
                      width: 15,
                      borderRadius: 5,
                    }}
                  />
                  <RNText
                    style={{
                      fontSize: 10,
                      marginLeft: 5,
                      fontFamily: "medium",
                    }}
                  >
                    {`${entry.label}: ${entry.value}% - ${entry.amount} cant.`}
                  </RNText>
                </View>
              ))}
            </View>
          </View>
          <RNText style={{ fontFamily: "bold", fontSize: 14, marginTop: 15 }}>
            Nuevos favoritos: diagrama de edad
          </RNText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <PieChart
              style={{ width: 150, height: 170 }}
              data={dataAge}
              outerRadius={"70%"}
              innerRadius={1}
            >
              <Labels />
            </PieChart>
            <View>
              {dataAge.map((entry, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: entry.svg.fill,
                      height: 15,
                      width: 15,
                      borderRadius: 5,
                    }}
                  />
                  <RNText
                    key={index}
                    style={{
                      fontSize: 10,
                      marginLeft: 5,
                      fontFamily: "medium",
                    }}
                  >
                    {`${entry.label}: ${entry.value}% - ${entry.amount} cant.`}
                  </RNText>
                </View>
              ))}
            </View>
          </View>
          <RNText style={{ fontFamily: "bold", fontSize: 14, marginTop: 15 }}>
            Nuevos favoritos: diagrama de ubicacion
          </RNText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <PieChart
              style={{ width: 150, height: 170 }}
              data={dataLocation}
              outerRadius={"70%"}
              innerRadius={1}
            >
              <Labels />
            </PieChart>
            <View>
              {dataLocation.map((entry, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: entry.svg.fill,
                      height: 15,
                      width: 15,
                      borderRadius: 5,
                    }}
                  />
                  <RNText
                    key={index}
                    style={{
                      fontSize: 10,
                      marginLeft: 5,
                      fontFamily: "medium",
                    }}
                  >
                    {`${entry.label}: ${entry.value}% - ${entry.amount} cant.`}
                  </RNText>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ marginTop: 15, marginBottom: 15 }}>
          <RNText
            style={{
              fontFamily: "bold",
              fontSize: 14,
              marginBottom: 10,
            }}
          >
            Lista de nuevos usuarios
          </RNText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
            }}
          >
            <RNText
              style={{
                fontFamily: "bold",
                textAlign: "center",
                flex: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderColor: "#1f1f1f",
                padding: 5,
                fontSize: 10,
              }}
            >
              Fecha
            </RNText>
            <RNText
              style={{
                fontFamily: "bold",
                textAlign: "center",
                flex: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderColor: "#1f1f1f",
                padding: 5,
                fontSize: 10,
              }}
            >
              Nombre
            </RNText>
            <RNText
              style={{
                fontFamily: "bold",
                textAlign: "center",
                flex: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderColor: "#1f1f1f",
                padding: 5,
                fontSize: 10,
              }}
            >
              Ubicación
            </RNText>
            <RNText
              style={{
                fontFamily: "bold",
                textAlign: "center",
                flex: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderColor: "#1f1f1f",
                padding: 5,
                fontSize: 10,
              }}
            >
              Genero
            </RNText>
            <RNText
              style={{
                fontFamily: "bold",
                textAlign: "center",
                flex: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderColor: "#1f1f1f",
                padding: 5,
                fontSize: 10,
              }}
            >
              Edad
            </RNText>
          </View>
          {dataResumen.map((usuario, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
                borderBottomWidth: 1,
                paddingBottom: 10,
              }}
            >
              <RNText
                style={{
                  textAlign: "center",
                  flex: 1,
                  fontSize: 10,
                  fontFamily: "light",
                }}
              >
                {usuario.fecha}
              </RNText>
              <RNText
                style={{
                  textAlign: "center",
                  flex: 1,
                  fontSize: 10,
                  fontFamily: "light",
                }}
              >
                {usuario.nombre}
              </RNText>
              <RNText
                style={{
                  textAlign: "center",
                  flex: 1,
                  fontSize: 10,
                  fontFamily: "light",
                }}
              >
                {usuario.ubicacion}
              </RNText>
              <RNText
                style={{
                  textAlign: "center",
                  flex: 1,
                  fontSize: 10,
                  fontFamily: "light",
                }}
              >
                {usuario.sexo}
              </RNText>
              <RNText
                style={{
                  textAlign: "center",
                  flex: 1,
                  fontSize: 10,
                  fontFamily: "light",
                }}
              >{`${usuario.edad}`}</RNText>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Analytics;
