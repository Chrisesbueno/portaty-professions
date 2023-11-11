export const settings = {
  buttons: [
    {
      title: "Introducción",
      subtitle: "Guía de nuestra aplicación.",
      icon: {
        left: require("@/utils/images/question.png"),
        right: require("@/utils/images/arrow_right.png"),
      },
      route: "Introduction",
      // routePush: true,
    },
    {
      title: "Política de privacidad",
      subtitle: "Ver detalles de nuestra política.",
      icon: {
        left: require("@/utils/images/folder.png"),
        right: require("@/utils/images/arrow_right.png"),
      },
      // route: "Terms",
      web: "https://www.portaty.com",
      // routePush: true,
    },
    {
      title: "Especificaciones de la aplicación",
      subtitle: "Ver detalles sobre la aplicación",
      icon: {
        left: require("@/utils/images/info_white.png"),
        right: require("@/utils/images/arrow_right.png"),
      },
      route: "About",
      // routePush: true,
    },
    {
      title: "Cerrar sesión",
      icon: {
        left: require("@/utils/images/exit.png"),
      },
      // route: "Welcome",
      // routePush: true,
    },
  ],
};
