import * as Linking from "expo-linking";
3;

export default {
  prefixes: [
    Linking.createURL("/"),
    "portaty://",
    "https://portaty.com",
    "https://www.portaty.com",
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
