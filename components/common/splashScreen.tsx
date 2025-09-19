import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiImage } from 'moti';
import logo1 from '@/assets/logo1.png';
import logo2 from '@/assets/logo2.png';
import logo3 from '@/assets/logo3.png';
import logo4 from '@/assets/logo4.png';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const SplashComponent = () => {
  const animationDuration = 1500;
  const animationDelay = 400;

  useEffect(() => {
    const timer = setTimeout(
      () => {
        router.push('/tabs/(tabs)/');
      },
      animationDuration + animationDelay * 3 + animationDelay,
    );
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <MotiImage
        source={logo2}
        style={styles.image}
        resizeMode="contain"
        from={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: 'timing',
          duration: animationDuration,
          delay: animationDelay,
        }}
      />
      <MotiImage
        source={logo1}
        style={styles.image}
        resizeMode="contain"
        from={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: 'timing',
          duration: animationDuration,
          delay: animationDelay * 2,
        }}
      />
      <MotiImage
        source={logo4}
        style={styles.image}
        resizeMode="contain"
        from={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: 'timing',
          duration: animationDuration,
          delay: animationDelay * 3,
        }}
      />
      <MotiImage
        source={logo3}
        style={styles.image}
        resizeMode="contain"
        from={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: 'timing',
          duration: animationDuration,
          delay: animationDelay * 4,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.main.background,
  },
  image: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
});

export default SplashComponent;
