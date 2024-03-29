import {
  View,
  ScrollView,
  Text as RNText,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
/* charts */
import { Circle, G, Line, Text } from "react-native-svg";
import { PieChart, BarChart } from "react-native-gifted-charts";
// amplify
import { API } from "aws-amplify";
import SkeletonAnalytics from "@/components/SkeletonAnalytics";

const buttons = [
  {
    id: 1,
    value: "Visitas",
  },
  // {
  //   id: 2,
  //   value: "Favoritos: Nuevos",
  // },
  // {
  //   id: 3,
  //   value: "Favoritos: Perdidos",
  // },
];

// const Labels = ({ slices }) => {
//   return slices.map((slice, index) => {
//     const { labelCentroid, data } = slice;
//     return (
//       <Text
//         key={index}
//         x={labelCentroid[0]}
//         y={labelCentroid[1]}
//         fill="#1f1f1f"
//         textAnchor="middle"
//         alignmentBaseline="middle"
//         fontSize={10}
//         fontWeight={700}
//       >
//         {`${data.amount === 0 ? "" : data.amount}`}
//       </Text>
//     );
//   });
// };

// const Decorator = ({ x, y, backUp }) => {
//   return backUp.map((value, index) => (
//     <G key={index}>
//       <Line
//         x1={x(index)}
//         y1={y(value)}
//         x2={x(index)}
//         y2={y(0)}
//         stroke="grey"
//         strokeDasharray={[5, 5]}
//       />
//       <Circle
//         cx={x(index)}
//         cy={y(value)}
//         r={4}
//         stroke="rgb(31, 31, 31)"
//         fill="#1f1f1f"
//       />
//       <Text
//         x={x(index)}
//         y={y(value) - 10}
//         fontSize={10}
//         fill="black"
//         alignmentBaseline="middle"
//         textAnchor="middle"
//         fontFamily="bold"
//       >
//         {value}
//       </Text>
//     </G>
//   ));
// };

const Analytics = ({ route }) => {
  const [type, setType] = useState(1);
  const [timeGraph, setTimeGraph] = useState(1);
  const [locationGraph, setLocationGraph] = useState(1);
  const [dataGraph, setDataGraph] = useState(null);
  const [dataLikes, setDataLikes] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [dataGraphYear, setDataGraphYear] = useState(null);
  const [dataLikesYear, setDataLikesYear] = useState(null);
  const [maxValueYear, setMaxValueYear] = useState(null);
  const [dataGenderPie, setDataGenderPie] = useState(null);
  const [dataGenderPieGraph, setDataGenderPieGraph] = useState(null);
  const [dataAgePieGraph, setDataAgePieGraph] = useState(null);
  const [dataCityPieGraph, setDataCityPieGraph] = useState(null);
  const [dataCountryPieGraph, setDataCountryPieGraph] = useState(null);
  const [dataCityPie, setDataCityPie] = useState(null);
  const [dataCountryPie, setDataCountryPie] = useState(null);
  const [dataAgePie, setDataAgePie] = useState(null);
  // const [currentData, setCurrentData] = useState(latestData);
  /* Condicionales */
  const [allZeroGender, setAllZeroGender] = useState(false);
  const [allZeroCity, setAllZeroCity] = useState(false);
  const [allZeroAge, setAllZeroAge] = useState(false);
  const customLabel = (val) => {
    return (
      <View style={{ width: 70, marginLeft: 7 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>{val}</Text>
      </View>
    );
  };
  const { data } = route.params;
  const getData = async () => {
    const api = "api-portaty";
    const path = "/athena/example2";
    const params = {
      headers: {},
      queryStringParameters: {
        businessID: data?.id,
      },
    };
    try {
      const response = await API.get(api, path, params);
      /* Likes */
      const dataForXAxis = Object.entries(response.data.likesData.days)
        .map(([date, value]) => ({
          value: Number(value),
          label: date.substring(5),
        }))
        .reverse();

      const likes = Object.values(response.data.likesData.days)
        .map((value) => +value)
        .reverse();
      const value = Math.max(...likes);

      /* Likes year */

      const dataForXAxisYear = Object.entries(response.data.likesData.year)
        .map(([date, value]) => ({
          value: Number(value),
          label: date,
        }))
        .reverse();

      const likesYear = Object.values(response.data.likesData.year)
        .map((value) => +value)
        .reverse();

      const valueYear = Math.max(...likesYear);

      /* Gender */
      const dataGender = response.data.gender;

      const gender = [];

      dataGender.map((item, index) => {
        if (item.genero === "Male") {
          gender.push({
            key: 1,
            value: Number(item.porcentaje_visitas),
            svg: { fill: "#ffb703" },
            label: "Hombre",
            amount: Number(item.cantidad_visitas),
          });
        }
        if (item.genero === "Female") {
          gender.push({
            key: 2,
            value: Number(item.porcentaje_visitas),
            svg: { fill: "#FFFA15" },
            label: "Mujer",
            amount: Number(item.cantidad_visitas),
          });
        }
        if (item.genero === "Others") {
          gender.push({
            key: 3,
            value: Number(item.porcentaje_visitas),
            svg: { fill: "#b28002" },
            label: "Otro",
            amount: Number(item.cantidad_visitas),
          });
        }
      });

      let maxObj = gender.reduce(
        (max, obj) =>
          parseInt(obj.porcentaje_visitas) > parseInt(max.porcentaje_visitas)
            ? obj
            : max,
        gender[0]
      );

      maxObj.arc = { outerRadius: "120%", cornerRadius: 10 };
      const genderPie = [];
      gender.map((item, index) => {
        genderPie.push({
          value: item.value,
          color: item.svg.fill,
          text: item.amount,
        });
      });

      /* City */
      const dataCity = response.data.city;

      let sortedData = [...dataCity].sort(
        (a, b) => b.porcentaje_visitas - a.porcentaje_visitas
      );

      let topThree = sortedData.slice(0, 3);

      const cities = [];

      topThree.map((item, index) => {
        if (index === 0) {
          cities.push({
            key: 1,
            value: Number(item.porcentaje_visitas),
            svg: { fill: "#FFFA15" },
            label: item.ciudad,
            amount: Number(item.numero_de_visitas),
          });
        }
        if (index === 1) {
          gender.push({
            key: 2,
            value: Number(item.porcentaje_visitas),
            svg: { fill: "#b28002" },
            label: item.ciudad,
            amount: Number(item.numero_de_visitas),
          });
        }
        if (index === 2) {
          gender.push({
            key: 3,
            value: Number(item.porcentaje_visitas),
            svg: { fill: "#D6D211" },
            label: item.ciudad,
            amount: Number(item.numero_de_visitas),
          });
        }
      });

      let remainingSum = sortedData
        .slice(3)
        .reduce((sum, item) => sum + item.porcentaje_visitas, 0);

      let remaining = {
        key: 4,
        value: remainingSum,
        svg: { fill: "#ffb703" },
        label: "Otros",
        amount: sortedData
          .slice(3)
          .reduce((sum, item) => sum + item.numero_de_visitas, 0),
      };
      cities.push(remaining);

      let maxCity = cities.reduce(
        (max, obj) =>
          parseInt(obj.porcentaje_visitas) > parseInt(max.porcentaje_visitas)
            ? obj
            : max,
        cities[0]
      );

      maxCity.arc = { outerRadius: "120%", cornerRadius: 10 };
      const citiesPie = [];
      cities.map((item, index) => {
        citiesPie.push({
          value: item.value,
          color: item.svg.fill,
          text: item.amount,
        });
      });

      /* Country */

      const dataCountry = response.data.country;

      let sortedDataCountry = [...dataCountry].sort(
        (a, b) => b.porcentaje_visitas - a.porcentaje_visitas
      );

      let ThreeCountry = sortedData.slice(0, 3);

      const countries = [];

      ThreeCountry.map((item, index) => {
        if (index === 0) {
          countries.push({
            key: 1,
            value: Number(item.porcentaje_visitas),
            svg: { fill: "#FFFA15" },
            label: item.pais,
            amount: Number(item.numero_de_visitas),
          });
        }
        if (index === 1) {
          countries.push({
            key: 2,
            value: Number(item.porcentaje_visitas),
            svg: { fill: "#b28002" },
            label: item.pais,
            amount: Number(item.numero_de_visitas),
          });
        }
        if (index === 2) {
          countries.push({
            key: 3,
            value: Number(item.porcentaje_visitas),
            svg: { fill: "#D6D211" },
            label: item.pais,
            amount: Number(item.numero_de_visitas),
          });
        }
      });

      let remainingSumCountry = sortedDataCountry
        .slice(3)
        .reduce((sum, item) => sum + item.porcentaje_visitas, 0);

      let remainingCountry = {
        key: 4,
        value: remainingSumCountry,
        svg: { fill: "#ffb703" },
        label: "Otros",
        amount: sortedDataCountry
          .slice(3)
          .reduce((sum, item) => sum + item.numero_de_visitas, 0),
      };
      countries.push(remainingCountry);

      let maxCountry = countries.reduce(
        (max, obj) =>
          parseInt(obj.porcentaje_visitas) > parseInt(max.porcentaje_visitas)
            ? obj
            : max,
        countries[0]
      );

      maxCountry.arc = { outerRadius: "120%", cornerRadius: 10 };

      const countriesPie = [];
      countries.map((item, index) => {
        countriesPie.push({
          value: item.value,
          color: item.svg.fill,
          text: item.amount,
        });
      });
      /* Age */

      const dataAge = response.data.age;

      const age = [];

      dataAge.map((item, index) => {
        if (item.rango_edad === "18-25") {
          age.push({
            key: 1,
            value: Number(item.porcentaje),
            svg: { fill: "#b28002" },
            label: "18-25 años",
            amount: Number(item.cantidad),
          });
        }
        if (item.rango_edad === "26-30") {
          age.push({
            key: 2,
            value: Number(item.porcentaje),
            svg: { fill: "#D6D211" },
            label: "26-30 años",
            amount: Number(item.cantidad),
          });
        }
        if (item.rango_edad === "31-40") {
          age.push({
            key: 3,
            value: Number(item.porcentaje),
            svg: { fill: "#FFD700" },
            label: "31-40 años",
            amount: Number(item.cantidad),
          });
        }
        if (item.rango_edad === "41-50") {
          age.push({
            key: 4,
            value: Number(item.porcentaje),
            svg: { fill: "#ffb703" },
            label: "41-50 años",
            amount: Number(item.cantidad),
          });
        }
        if (item.rango_edad === "50+") {
          age.push({
            key: 5,
            value: Number(item.porcentaje),
            svg: { fill: "#FFFA15" },
            label: "50+ años",
            amount: Number(item.cantidad),
          });
        }
      });

      let maxAge = age.reduce(
        (max, obj) =>
          parseInt(obj.porcentaje) > parseInt(max.porcentaje) ? obj : max,
        age[0]
      );

      maxAge.arc = { outerRadius: "120%", cornerRadius: 10 };

      const agePie = [];
      age.map((item, index) => {
        agePie.push({
          value: item.value,
          color: item.svg.fill,
          text: item.amount,
        });
      });

      setAllZeroGender(gender.every((item) => item.value === 0));
      setAllZeroCity(cities.every((item) => item.value === 0));
      setAllZeroAge(age.every((item) => item.value === 0));

      console.log("datagraph", dataForXAxisYear);
      console.log("maxvalue", valueYear);
      console.log("width", likesYear.length * 60);
      setDataGenderPie(gender);
      setDataGenderPieGraph(genderPie);
      setDataAgePie(age);
      setDataAgePieGraph(agePie);
      setDataCityPie(cities);
      setDataCityPieGraph(citiesPie);
      setDataCountryPie(countries);
      setDataCountryPieGraph(countriesPie);
      setDataGraph(dataForXAxis);
      setMaxValue(value);
      setDataLikes(likes);
      setDataGraphYear(dataForXAxisYear);
      setMaxValueYear(valueYear);
      setDataLikesYear(likesYear);
    } catch (error) {
      console.log(error);
    }
  };
  // const lineData = [
  //   { value: 10, label: "2024-03-15" },
  //   { label: "2024-03-14", value: 5 },
  // ];

  useEffect(() => {
    getData();
  }, []);

  if (
    dataGraph !== null &&
    dataLikes !== null &&
    maxValue !== null &&
    dataGenderPie !== null &&
    dataCityPie !== null &&
    dataCountryPie !== null &&
    dataAgePie !== null
  ) {
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
          <RNText
            style={{
              fontFamily: "lightItalic",
              fontSize: 11,
              marginBottom: 5,
              textAlign: "right",
            }}
          >
            Las estadisticas se actualizan cada 12 horas (00:00UTC - 12:00UTC)
          </RNText>
          <View
            style={{
              borderColor: "#1f1f1f",
              borderWidth: 0.7,
              borderRadius: 5,
              paddingLeft: 5,
              paddingRight: 15,
              paddingTop: 10,
              paddingBottom: 10,
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
              Grafico de visitas
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
                  marginHorizontal: 5,
                  backgroundColor: timeGraph === 1 ? "#ffb703" : "#ffffff",
                }}
                onPress={() => setTimeGraph(1)}
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
                  1 año
                </RNText>
              </TouchableOpacity>
            </View>
            {timeGraph === 1 ? (
              <View
                style={{
                  height: 250,
                  flexDirection: "row",
                }}
              >
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ width: dataGraph.length * 64}}>
                    <BarChart
                      barWidth={22}
                      spacing={40}
                      noOfSections={2}
                      barBorderRadius={4}
                      frontColor="#ffb703"
                      data={dataGraph}
                      yAxisThickness={1}
                      xAxisThickness={1}
                    />
                  </View>
                </ScrollView>
              </View>
            ) : (
              <View
                style={{
                  height: 250,
                  flexDirection: "row",
                }}
              >
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ width: dataGraphYear.length * 90 }}>
                  <BarChart
                      barWidth={22}
                      spacing={60}
                      noOfSections={2}
                      barBorderRadius={4}
                      frontColor="#ffb703"
                      data={dataGraphYear}
                      yAxisThickness={1}
                      xAxisThickness={1}
                    />
                  </View>
                </ScrollView>
              </View>
            )}
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
            <RNText
              style={{
                fontFamily: "lightItalic",
                fontSize: 12,
                marginBottom: 20,
                textAlign: "right",
              }}
            >
              Desde que existe el negocio
            </RNText>
            <RNText style={{ fontFamily: "bold", fontSize: 14, marginTop: 5 }}>
              Visitas: diagrama de genero
            </RNText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1,
                marginVertical: 20,
              }}
            >
              {allZeroGender ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RNText
                    style={{
                      fontFamily: "medium",
                      fontSize: 14,
                    }}
                  >
                    Sin datos
                  </RNText>
                </View>
              ) : (
                <PieChart
                  showText
                  textColor="black"
                  radius={70}
                  textSize={12}
                  data={dataGenderPieGraph}
                />
              )}
              <View>
                {dataGenderPie.map((entry, index) => (
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
              Visitas: diagrama de edad
            </RNText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1,
                marginVertical: 20,
              }}
            >
              {allZeroAge ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RNText
                    style={{
                      fontFamily: "medium",
                      fontSize: 14,
                    }}
                  >
                    Sin datos
                  </RNText>
                </View>
              ) : (
                <PieChart
                  showText
                  textColor="black"
                  radius={70}
                  textSize={12}
                  data={dataAgePieGraph}
                />
              )}
              <View>
                {dataAgePie.map((entry, index) => (
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
              Visitas: diagrama de ubicacion
            </RNText>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#1f1f1f",
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  borderRadius: 5,
                  marginHorizontal: 5,
                  backgroundColor: locationGraph === 1 ? "#ffb703" : "#ffffff",
                }}
                onPress={() => setLocationGraph(1)}
              >
                <RNText
                  style={{
                    fontFamily: "medium",
                    fontSize: 12,
                    // textAlign: "center",
                  }}
                >
                  Por ciudad
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
                  backgroundColor: locationGraph === 2 ? "#ffb703" : "#ffffff",
                }}
                onPress={() => setLocationGraph(2)}
              >
                <RNText
                  style={{
                    fontFamily: "medium",
                    fontSize: 12,
                    // textAlign: "center",
                  }}
                >
                  Por pais
                </RNText>
              </TouchableOpacity>
            </View>

            {locationGraph === 1 ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flex: 1,
                  marginVertical: 20,
                }}
              >
                {allZeroCity ? (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RNText
                      style={{
                        fontFamily: "medium",
                        fontSize: 14,
                      }}
                    >
                      Sin datos
                    </RNText>
                  </View>
                ) : (
                  <PieChart
                    showText
                    textColor="black"
                    radius={70}
                    textSize={12}
                    data={dataCityPieGraph}
                  />
                )}
                <View>
                  {dataCityPie.map((entry, index) => (
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
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flex: 1,
                  marginVertical: 20,
                }}
              >
                {allZeroCity ? (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RNText
                      style={{
                        fontFamily: "medium",
                        fontSize: 14,
                      }}
                    >
                      Sin datos
                    </RNText>
                  </View>
                ) : (
                  <PieChart
                    showText
                    textColor="black"
                    radius={70}
                    textSize={12}
                    data={dataCountryPieGraph}
                  />
                )}
                <View>
                  {dataCountryPie.map((entry, index) => (
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
            )}
          </View>

          {/* <View style={{ marginTop: 15, marginBottom: 15 }}>
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
          </View> */}
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View
        style={[
          {
            flex: 1,
          },
          global.bgWhite,
        ]}
      >
        <View style={{ paddingTop: 20, backgroundColor: "#ffffff" }}></View>
        <SkeletonAnalytics />
      </View>
    );
  }
};

export default Analytics;
