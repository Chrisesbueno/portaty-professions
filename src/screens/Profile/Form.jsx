import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import styles from "@/utils/styles/RegisterForm.module.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import CustomTags from "@/components/CustomTags";
import * as ImagePicker from "expo-image-picker";
import { Auth, API } from "aws-amplify";
import * as customProfile from "@/graphql/CustomQueries/Profile";
import * as mutations from "@/graphql/CustomMutations/Profile";
import CustomActivities from "@/components/CustomActivities";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activitySelect,
  mapBusiness,
  profileState,
  tagsList,
  updateProfile,
  userAuthenticated,
  mapUser,
} from "@/atoms";
import MapMarketBusiness from "@/components/MapMarketBusiness";
// lengaujhe
import { es } from "@/utils/constants/lenguage";
import ModalAlert from "@/components/ModalAlert";
import { AntDesign } from "@expo/vector-icons";
import * as Cellular from "expo-cellular";
import SkeletonExample from "@/components/SkeletonForm";

const Form = ({ navigation, route }) => {
  const userLocation = useRecoilValue(mapUser);
  const global = require("@/utils/styles/global.js");
  // const { user } = route.params;
  const { control, handleSubmit } = useForm();
  const [image, setImage] = useState(null);
  const [blobImage, setBlobImage] = useState(null);
  const [country, setCountry] = useState(null);
  const [activitiesList, setActivitiesList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [visibleCountries, setVisibleCountries] = useState(false);
  const activity = useRecoilValue(activitySelect);
  const tags = useRecoilValue(tagsList);
  const userAuth = useRecoilValue(userAuthenticated);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusProfile, setStatusProfile] = useRecoilState(updateProfile);
  const [imageB64, setImageB64] = useState("");
  /* Para limpiar */
  const [selectTagsList, setSelectTagsList] = useRecoilState(tagsList);
  const [selectActivity, setSelectActivity] = useRecoilState(activitySelect);
  const [selectMapBusiness, setSelectMapBusiness] = useRecoilState(mapBusiness);
  const [stateProfile, setStateProfile] = useRecoilState(profileState);

  async function getCountryCode(array) {
    const countryCode = await Cellular.getIsoCountryCodeAsync();
    console.log(countryCode.toUpperCase());
    array.map((item, index) => {
      if (item.cca2 === countryCode.toUpperCase()) setCountry(item);
    });
  }

  const filteredCountries = countries.filter((item) =>
    item?.name?.common.toLowerCase().includes(searchCountry.toLowerCase())
  );

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
      quality: 0.1,
      base64: true,
    });
    if (!result.canceled) {
      setImageB64(result.assets[0].base64);
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
    return;
    setLoading(true);
    const { identityId } = await Auth.currentUserCredentials();
    const { company, email, phone, wsme, coordinates, description } = data;
    let code = country?.idd?.root;
    console.log(code);
    for (let i = 0; i < country?.idd?.suffixes.length; i++) {
      code += country?.idd?.suffixes[i];
    }
    console.log(code);
    try {
      let number = `${code}${phone}`;
      console.log(number);
      const business = await API.graphql({
        query: mutations.createBusiness,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          input: {
            userID: user,
            name: company,
            email: email,
            phone: number,
            whatsapp: wsme,
            description: description,
            image: "",
            identityID: identityId,
            coordinates: {
              lat: coordinates.latitude,
              lon: coordinates.longitude,
            },
            activity: activity.name,
            tags: [`[${company}]`, ...tags],
          },
        },
      });

      const apiName = "api-professions-gateway"; // replace this with your api name.
      const path = "/thumbnailgenerator"; //replace this with the path you have configured on your API
      const myInit = {
        body: {
          identityid: identityId,
          businessid: business?.data?.createBusiness?.id,
          action: "create",
          type: "profile",
          key: 0,
          description,
          image: imageB64,
        }, // replace this with attributes you need
        headers: {}, // OPTIONAL
      };
      const result = await API.post(apiName, path, myInit);
      console.log(result);

      setStateProfile(true);
      setLoading(false);
      setVisible(true);
    } catch (error) {
      setError(`Error al cargar negocio:  ${JSON.stringify(error)}`);
      console.log(`Error al cargar negocio:  ${error}`);
      setVisible(true);
    }
    setLoading(false);
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
    navigation.navigate("Unprofile");
  };
  useEffect(() => {
    MultipleData();
    BlankInputs();
    fetch(`https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2`)
      .then((response) => {
        return response.json();
      })
      .then((item) => {
        setCountries(item);
        getCountryCode(item);
      });
  }, []);

  /*  */
  if (country === null) return <SkeletonExample />;
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
        <View>
          <Text style={styles.labelInput}>Telefono*</Text>

          <TouchableOpacity
            style={[
              styles.inputContainerBot,
              {
                height: 50,
                width: 100,
                marginRight: 10,
              },
            ]}
            onPress={() => setVisibleCountries(!visibleCountries)}
          >
            {/* <View> */}
            <Image
              style={{
                width: 20,
                height: 20,
                borderRadius: 30,
                marginLeft: 10,
                marginRight: 2,
                resizeMode: "contain",
              }}
              source={{
                uri: country ? country?.flags?.png : countries[0]?.flags?.png,
              }}
            />
            <Text
              style={{
                fontFamily: "medium",
                fontSize: 14,
                color: "#000",
                marginRight: 5,
                // width: 100,
              }}
            >
              {country?.idd?.root}
              {country?.idd?.suffixes.map((item) => item)}
            </Text>
            <AntDesign name="caretdown" size={15} color="gray" />
            {/* </View> */}
            {/* <Text></Text> */}
          </TouchableOpacity>
          <Modal
            animationType="none"
            transparent={true}
            visible={visibleCountries}
            onRequestClose={() => {
              setVisibleCountries(!visibleCountries);
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalTop}>
                  <Pressable
                    onPress={() => {
                      setVisibleCountries(!visibleCountries);
                    }}
                  >
                    <Image
                      style={{
                        margin: 5,
                        width: 25,
                        height: 25,
                        resizeMode: "contain",
                      }}
                      source={require("@/utils/images/arrow_back.png")}
                    />
                  </Pressable>
                </View>
                <View style={{ flex: 1 }}>
                  {/* <Text style={{ fontFamily: "light", padding: 5 }}>
                    Elige un codigo de area
                  </Text> */}
                  <TextInput
                    value={searchCountry}
                    onChangeText={(e) => setSearchCountry(e)}
                    placeholder={`Busca tu pais`}
                    defaultValue={searchCountry}
                    style={{
                      margin: 5,
                      borderWidth: 0.4,
                      borderColor: "#eee",
                      padding: 5,
                      fontFamily: "light",
                      fontSize: 12,
                      borderRadius: 5,
                    }}
                  />
                  <View style={[{ flex: 1 }]}>
                    <FlatList
                      data={searchCountry ? filteredCountries : countries}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            // styles.inputContainerBot,
                            {
                              height: 40,
                              width: 210,
                              flexDirection: "row",
                              borderWidth: 0.5,
                              borderColor: "#eee",
                              alignItems: "center",
                              marginHorizontal: 5,
                            },
                          ]}
                          onPress={() => {
                            setCountry(item);
                            setVisibleCountries(!visibleCountries);
                          }}
                        >
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              marginHorizontal: 10,
                              resizeMode: "contain",
                            }}
                            source={{ uri: item?.flags?.png }}
                          />
                          <Text
                            style={{
                              fontFamily: "light",
                              fontSize: 11,
                              color: "#000",
                              width: 100,
                            }}
                          >
                            {item?.idd?.root}
                            {item?.idd?.suffixes.map((item) => item)}{" "}
                            {item?.name?.common}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => index}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <CustomInput
          control={control}
          name={`phone`}
          placeholder={`123 4567891011`}
          styled={{
            text: styles.textInput,
            label: [styles.labelInput],
            error: styles.errorInput,
            input: [styles.inputContainer],
            placeholder: styles.placeholder,
          }}
          text={` `}
          rules={{
            required: es.businessForm.register.email.rules,
          }}
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
      <CustomInput
        control={control}
        name={`description`}
        placeholder={`Escribe una descripcion de tu negocio. Hacerla lo mas detallada posible mejorara tu posicionamiento en la busqueda`}
        styled={{
          text: styles.textInputDescription,
          label: [styles.labelInput],
          error: styles.errorInput,
          input: [styles.inputContainerDescription],
          placeholder: styles.placeholderDescription,
        }}
        lines={10}
        area={true}
        text={`Descripcion`}
      />
      {userLocation ? (
        <MapMarketBusiness
          control={control}
          initialLocation={userLocation}
          name={"coordinates"}
          text={"Abrir Mapa"}
          placeholder={"Selecciona una Ubicacion"}
          // rules={{
          //   required: es.businessForm.register.email.rules,
          // }}
        />
      ) : (
        <ActivityIndicator color={`#ffb703`} />
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
          <ActivityIndicator size="small" color="#1f1f1f" />
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
