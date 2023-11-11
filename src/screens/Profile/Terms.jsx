import { View, Text } from 'react-native'
import React from 'react'

const Terms = () => {
  const global = require("@/utils/styles/global.js");
  return (
    <View style={[{flex: 1, padding: 20}, global.bgWhite]}>
      <Text>Terms</Text>
    </View>
  )
}

export default Terms