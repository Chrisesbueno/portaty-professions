import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeftHeader from "@/components/Header/LeftHeader";
import ConfirmRegister from "@/screens/Auth/ConfirmRegister";
import Register from "@/screens/Auth/Register";


const Stack = createNativeStackNavigator();

const RegisterNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName={`Register`}>
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          header: (props) => <LeftHeader {...props} />,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="ConfirmRegister"
        component={ConfirmRegister}
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
};



export default RegisterNavigator;
