import React from 'react';
import GenericAuth from './genericAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const AuthWithEmail = () => {
  return <SafeAreaView style={{ flex: 1, backgroundColor: Colors.main.background }}>
    <GenericAuth authType="email" />
  </SafeAreaView>
};

export default AuthWithEmail;
