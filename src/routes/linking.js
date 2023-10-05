import * as Linking from "expo-linking";
3;

console.log("LINK CREADO:", Linking.createURL("/"));
export default {
  prefixes: [
    Linking.createURL("/"),
    "https://www.portaty.com/",
    "https://www.portaty.com/share/list",
    "https://www.portaty.com/share/business",
  ],
  config: {
    screens: {
      ShareNavigator: {
        screens: {
          ShareListPage: {
            path: "share/list",
          },
        },
      },
      SharePage: {
        path: "share/business",
      },
    },
  },
};
