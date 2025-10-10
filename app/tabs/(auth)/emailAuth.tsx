import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { DynamicLogin } from './genericAuth';

const AuthWithEmail = () => {
  return <SafeAreaView style={{ flex: 1, backgroundColor: Colors.main.background }}>
    <DynamicLogin />
  </SafeAreaView>
};

export default AuthWithEmail;
