import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
// recoil
import { useSetRecoilState } from "recoil";
import { mapUser } from "@/atoms";
const useLocation = () => {
  const [location, setLocation] = useState(null);
  const setUserLocation = useSetRecoilState(mapUser);
  // const getLocation = async () => {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     console.log("Permission to access location was denied");
  //     return;
  //   }
  //   console.log("STATUS DE LOCATION: ", status);
  //   const locationData = await Location.getCurrentPositionAsync({
  //     accuracy: Location.Accuracy.Lowest,
  //     mayShowUserSettingsDialog: true,
  //   });
  //   console.log("COORDENADAS OBTENIDAS: ", locationData.coords);
  //   setLocation(locationData.coords);
  //   setUserLocation(locationData.coords);
  // };
  // useEffect(() => {
  //   getLocation();
  // }, []);

  useEffect(() => {
    let subscription;

    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Permiso de ubicación denegado");
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 30000, // Actualizar cada 5 segundos (ajusta según tus necesidades)
            distanceInterval: 10, // Actualizar si el usuario se mueve al menos 10 metros
          },
          (locationResult) => {
            const { latitude, longitude } = locationResult.coords;
            console.log("COORDENADAS OBTENIDAS: ", { latitude, longitude });
            setLocation({ latitude, longitude });
            setUserLocation({ latitude, longitude });
          }
        );
      } catch (err) {
        // setError("Error al obtener la ubicación");
      }
    };

    startLocationUpdates();

    return () => {
      // Limpia la suscripción cuando el componente se desmonta
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { location };
};

export default useLocation;
