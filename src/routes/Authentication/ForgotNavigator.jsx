import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LeftHeader from "@/components/Header/LeftHeader";
import ConfirmForgot from "@/screens/Auth/ConfirmForgot";
import Forgot from "@/screens/Auth/Forgot";

const Stack = createNativeStackNavigator();

const ForgotNavigator = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName={`Forgot`}>
      <Stack.Screen
        name="Forgot"
        component={Forgot}
        options={{
          header: (props) => <LeftHeader {...props} />,
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen
        name="ConfirmForgot"
        component={ConfirmForgot}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ForgotNavigator;
