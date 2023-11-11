import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import styles from "@/utils/styles/RegisterForm.module.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import CustomTags from "@/components/CustomTags";
import * as ImagePicker from "expo-image-picker";
import { Auth, API, Storage } from "aws-amplify";
import * as queries from "@/graphql/queries";
import * as customProfile from "@/graphql/CustomQueries/Profile";
import * as mutations from "@/graphql/CustomMutations/Profile";
import CustomActivities from "@/components/CustomActivities";
import { useRecoilState, useRecoilValue } from "recoil";
import { activitySelect, mapBusiness, profileState, tagsList } from "@/atoms";
import MapMarketBusiness from "@/components/MapMarketBusiness";
// hooks
import useLocation from "@/hooks/useLocation";
// lengaujhe
import { es } from "@/utils/constants/lenguage";
import ModalAlert from "@/components/ModalAlert";
const Form = ({ navigation, route }) => {
  const { location } = useLocation();
  const global = require("@/utils/styles/global.js");
  const { user } = route.params;
  const { control, handleSubmit } = useForm();
  const [image, setImage] = useState(null);
  const [blobImage, setBlobImage] = useState(null);
  const [activitiesList, setActivitiesList] = useState([]);
  const activity = useRecoilValue(activitySelect);
  const tags = useRecoilValue(tagsList);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Para limpiar */
  const [selectTagsList, setSelectTagsList] = useRecoilState(tagsList);
  const [selectActivity, setSelectActivity] = useRecoilState(activitySelect);
  const [selectMapBusiness, setSelectMapBusiness] = useRecoilState(mapBusiness);
  const [stateProfile, setStateProfile] = useRecoilState(profileState);

  function urlToBlob(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", url);
      xhr.responseType = "blob"; // convert type
      xhr.send();
    });
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [6, 4],
      quality: 1,
    });
    if (!result.canceled) {
      const { uri } = result.assets[0];
      const blobData = await urlToBlob(uri);
      setBlobImage(blobData);
      setImage(uri);
    }
  };
  const BlankInputs = () => {
    setSelectTagsList([]);
    setSelectActivity({});
    setSelectMapBusiness({});
  };
  const onRegisterBusiness = async (data) => {
    setLoading(true);
    const { identityId } = await Auth.currentUserCredentials();
    const { company, email, phone, wsme, coordinates } = data;
    try {
      
      const business = await API.graphql({
        query: mutations.createBusiness,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          input: {
            userID: user,
            name: company,
            email: email,
            phone: phone,
            whatsapp: wsme,
            image: '',
            identityID: identityId,
            coordinates: {
              lat: coordinates.latitude,
              lon: coordinates.longitude,
            },
            activity: activity.name,
            tags: tags,
          },
        },
      });
      const { key } = await Storage.put(
        `business/${business?.data?.createBusiness?.id}/profile.jpg`,
        blobImage,
        {
          level: "protected",
          contentType: "image/jpeg",
        }
      );
      const businessUpdate = await API.graphql({
        query: mutations.updateBusiness,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          input: {
            id: business?.data?.createBusiness?.id,
            image: key,
          },
        },
      });
      console.log(business);
      console.log(businessUpdate);
      setStateProfile(true);
      setLoading(false);
      setVisible(true);
    } catch (error) {
      setError(`Error al cargar negocio:  ${JSON.stringify(error)}`);
      setVisible(true);
    }
  };
  const MultipleData = async () => {
    const activities = await API.graphql({
      query: customProfile.listActivities,
    });
    setActivitiesList(activities.data.listActivities.items);
  };

  const CloseModal = () => {
    setVisible(false);
    BlankInputs();
    navigation.goBack();
  };
  useEffect(() => {
    MultipleData();
    BlankInputs();
  }, []);

  /*  */
  return (
    <ScrollView style={[global.bgWhite, styles.container]}>
      <CustomInput
        control={control}
        name={`company`}
        placeholder={`Portaty C.A.`}
        styled={{
          text: styles.textInput,
          label: [styles.labelInput],
          error: styles.errorInput,
          input: [styles.inputContainer],
          placeholder: styles.placeholder,
        }}
        text={`Nombre del negocio*`}
        rules={{
          required: es.businessForm.register.company.rules,
        }}
      />
      <CustomInput
        control={control}
        name={`email`}
        placeholder={`soporte@portaty.com`}
        styled={{
          text: styles.textInput,
          label: [styles.labelInput],
          error: styles.errorInput,
          input: [styles.inputContainer],
          placeholder: styles.placeholder,
        }}
        text={`Correo electronico*`}
        rules={{
          required: es.businessForm.register.email.rules,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <CustomInput
          control={control}
          name={`phone`}
          placeholder={`+58 123 4567`}
          styled={{
            text: styles.textInputBot,
            label: [styles.labelInputBot],
            error: styles.errorInput,
            input: [styles.inputContainerBot],
            placeholder: styles.placeholderBot,
          }}
          text={`Telefono*`}
          rules={{
            required: es.businessForm.register.email.rules,
          }}
        />
        <CustomInput
          control={control}
          name={`wsme`}
          placeholder={`ws.yourlink.me`}
          styled={{
            text: styles.textInputBot,
            label: [styles.labelInputBot],
            error: styles.errorInput,
            input: [styles.inputContainerBot],
            placeholder: styles.placeholderBot,
          }}
          text={`Whats App Me`}
        />
      </View>

      {activitiesList.length !== 0 ? (
        <CustomActivities data={activitiesList} />
      ) : (
        <CustomInput
          control={control}
          name={`activity`}
          placeholder={`Selecciona tu actividad laboral`}
          styled={{
            text: styles.textInput,
            label: [styles.labelInput],
            error: styles.errorInput,
            input: [styles.inputContainer],
            placeholder: styles.placeholder,
          }}
          text={`Actividad Laboral`}
          rules={{
            required: es.businessForm.register.email.rules,
          }}
        />
      )}

      {activity.name ? (
        <CustomTags data={activity} />
      ) : (
        <CustomInput
          control={control}
          name={`tags`}
          placeholder={`Selecciona tus tags`}
          styled={{
            text: styles.textInput,
            label: [styles.labelInput],
            error: styles.errorInput,
            input: [styles.inputContainer],
            placeholder: styles.placeholder,
          }}
          text={`Tags`}
        />
      )}
      {location ? (
        <MapMarketBusiness
          control={control}
          initialLocation={location}
          name={"coordinates"}
          text={"Abrir Mapa"}
          placeholder={"Selecciona una Ubicacion"}
          // rules={{
          //   required: es.businessForm.register.email.rules,
          // }}
        />
      ) : (
        <ActivityIndicator />
      )}

      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          position: "relative",
        }}
        onPress={pickImage}
      >
        <View
          style={{
            width: 100,
            height: 100,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 0.5,
            borderStyle: "dashed",
            borderRadius: 5,
          }}
        >
          {image ? (
            <Image
              style={{
                width: 95,
                height: 95,
                borderRadius: 5,
              }}
              source={{ uri: image }}
            />
          ) : (
            <Image
              style={{
                width: 27,
                height: 27,
                resizeMode: "contain",
              }}
              source={require("@/utils/images/cameraadd.png")}
            />
          )}
        </View>
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: "light",
          fontSize: 14,
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        Sube una imagen de tu negocio
      </Text>
      <TouchableOpacity
        style={[
          global.mainBgColor,
          {
            borderRadius: 8,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: 55,
            marginTop: 10,
            marginBottom: 125,
          },
        ]}
        onPress={handleSubmit(onRegisterBusiness)}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={[global.white, { fontFamily: "medium", fontSize: 14 }]}>
            {`Registrar`}
          </Text>
        )}
      </TouchableOpacity>
      <ModalAlert
        text={error ? error : `Tu negocio ha sido registrado con exito`}
        close={() => {
          if (error) {
            setVisible(false);
          } else {
            CloseModal();
          }
        }}
        icon={
          error
            ? require("@/utils/images/error.png")
            : require("@/utils/images/successful.png")
        }
        open={visible}
      />
    </ScrollView>
  );
};

export default Form;
