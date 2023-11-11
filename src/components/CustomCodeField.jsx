import { codeFields } from '@/atoms';
import React, {useState} from 'react';
import { useEffect } from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useRecoilState } from 'recoil';

const styles = StyleSheet.create({
  root: {flex: 1},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 45,
    height: 45,
    lineHeight: 43,
    fontSize: 18,
    fontFamily: 'light',
    borderWidth: 1,
    borderColor: '#fb8500',
    textAlign: 'center',
    borderRadius: 10
  },
  focusCell: {
    borderColor: '#fb8500',
  },
});

const CELL_COUNT = 6;

const CustomCodeField = () => {
    const [value, setValue] = useState('');
    const [codeInputs, setCodeInputs] = useRecoilState(codeFields);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    setCodeInputs(value)
  }, [value])
  
  return (
    <SafeAreaView style={styles.root}>
      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor/> : null)}
          </Text>
        )}
      />
    </SafeAreaView>
  );
};

export default CustomCodeField;