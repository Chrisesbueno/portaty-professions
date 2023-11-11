import React, { useState, useEffect } from "react";

// Recoil
import { useRecoilState } from "recoil";
import { userAuthenticated } from "@/atoms/Modals";
// Amplify
import { Storage } from "aws-amplify";

const useImageStorage = () => {
  const [userAuth, setUserAuth] = useRecoilState(userAuthenticated);
  const fetchImageFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const uploadImage = async (filename, uri) => {
    try {
      const image = await fetchImageFromUri(uri);
      const { key } = await Storage.put(filename, image, {
        level: "public",
        contentType: "image/jpeg",
        progressCallback(progress) {
          // setLoading(progress);
        },
      });
      return key;
    } catch (error) {
      console.log(error);
    }
  };
  // descarag de imagenes propias del usuario
  const downloadImage = async (key, level) => {
    try {
      // configuracion del storage
      Storage.configure({ level: "protected" });
      // peticion de la imagen con su key y el level que lo requiero
      const url = await Storage.get(key, { level: "protected" });
      return url;
    } catch (error) {
      console.log(error);
    }
  };

  // descargas de imagenes de otros usuarios
  const downloadImageOther = async (key, level, identityId) => {
    // if (key === "" || level === "" || identityId === "") return console.log("CAMPOS VACIOS IMAGEN OTHER");
    try {
      const url = await Storage.get(key, {
        level: level,
        identityId: identityId, // the identityId of that user
      });
      return url;
    } catch (error) {
      console.log(error);
    }
  };

  return { uploadImage, downloadImage, downloadImageOther };
};

export default useImageStorage;
