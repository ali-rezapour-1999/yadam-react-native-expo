import React from 'react';
import { router } from 'expo-router';
import { useEffect } from 'react';

const AuthIndex: React.FC = () => {
  useEffect(() => {
    router.replace('/tabs/(auth)/emailAuth');
  }, []);

  return null;
};

export default AuthIndex;
