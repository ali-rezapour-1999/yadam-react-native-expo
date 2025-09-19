import React from 'react';
import { Pressable } from 'react-native';
import { MotiView } from 'moti';
import { CheckIcon } from '@/assets/Icons/Check';
import { Colors } from '@/constants/Colors';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export const Checkbox = ({ checked, onPress }: CheckboxProps) => {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <MotiView
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: checked ? '' : Colors.main.background,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? Colors.main.primary : 'transparent',
        }}
        from={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: checked ? 1 : 0.8,
          opacity: checked ? 1 : 0,
        }}
        transition={{
          type: 'timing',
          duration: 250,
        }}
      >
        {checked && <CheckIcon />}
      </MotiView>

      {!checked && (
        <MotiView
          style={{
            position: 'absolute',
            width: 26,
            height: 26,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: Colors.main.primary,
          }}
          from={{ opacity: 1 }}
          animate={{ opacity: checked ? 0 : 1 }}
          transition={{
            type: 'timing',
            duration: 250,
          }}
        />
      )}
    </Pressable>
  );
};
