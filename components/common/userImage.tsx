import React from 'react';
import { Box } from '../ui/box';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';

const UserImage = ({ width = 55, height = 55 }) => {
  return (
    <LinearGradient
      colors={['#a855f7', '#06b6d4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: width + 20,
        height: height + 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        style={{
          borderRadius: 45,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('@/assets/images/personIcons.png')}
          style={{
            width: width,
            height: height,
            borderRadius: 40,
          }}
        />
      </Box>
    </LinearGradient>
  );
};

export default UserImage;
