import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
// recoil
import { useSetRecoilState } from "recoil";
import { mapUser } from "@/atoms";
const useLocation = () => {
  const [location, setLocation] = useState(null);
  const setUserLocation = useSetRecoilState(mapUser);
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
            accuracy: Location.Accuracy.High,
            mayShowUserSettingsDialog: true,
          },
          (locationResult) => {
            const { latitude, longitude } = locationResult.coords;
            setLocation({ latitude, longitude });
            setUserLocation({ latitude, longitude });
            console.log("Se actualizo el location")
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
