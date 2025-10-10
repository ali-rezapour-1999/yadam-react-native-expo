import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { Text } from '../Themed';
import { Button } from '../ui/button';
import { Colors } from '@/constants/Colors';

interface AppModalProps {
  title: string;
  children: React.ReactNode;
  buttonContent?: React.ReactNode;
  buttonStyle?: StyleProp<ViewStyle>;
  modalContainerStyle?: StyleProp<ViewStyle>;
  modalContentStyle?: StyleProp<ViewStyle>;
  modalBodyStyle?: StyleProp<ViewStyle>;
  visible?: boolean;
  onChangeVisible?: (open: boolean) => void;
}

export default function AppModal({
  title,
  children,
  buttonContent,
  buttonStyle,
  modalContainerStyle,
  modalContentStyle,
  modalBodyStyle,
  visible,
  onChangeVisible,
}: AppModalProps) {
  const [internalVisible, setInternalVisible] = useState(false);

  const isControlled = visible !== undefined;
  const isOpen = isControlled ? visible : internalVisible;

  const toggle = useCallback(() => {
    if (isControlled && onChangeVisible) {
      onChangeVisible(!isOpen);
    } else {
      setInternalVisible(prev => !prev);
    }
  }, [isControlled, isOpen, onChangeVisible]);

  return (
    <>
      <Button
        onPress={toggle}
        style={[styles.button, buttonStyle]}
        accessibilityLabel="Open modal"
      >
        {buttonContent || <Text>Open Modal</Text>}
      </Button>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={toggle}
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={toggle} />

        <View style={[styles.modalContainer, modalContainerStyle]}>
          <View style={[styles.modalContent, modalContentStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
            </View>

            <ScrollView
              style={[styles.modalBody, modalBodyStyle]}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    width: '100%',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  modalContent: {
    backgroundColor: Colors.main.background,
    borderRadius: 12,
    minHeight: '15%',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
    overflow: 'hidden',
  },

  modalHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'ios' ? 20 : 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.main.border,
  },

  modalTitle: {
    fontSize: 18,
    color: Colors.main.textPrimary,
  },

  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
