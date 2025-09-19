import { TouchableOpacity, I18nManager, Platform, StyleSheet, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Text, View } from '../Themed';
import { t } from 'i18next';
import { Box } from '../ui/box';
import { ChevronDownIcon, ChevronUpIcon, Icon } from '@/components/ui/icon';
import { useState } from 'react';
import { Button } from '../ui/button';
import Modal from 'react-native-modal';

interface ModalOptionProps {
  children: React.ReactNode;
  title: string;
  onCloseProps?: (isOpen: boolean) => void;
  isOpenProps?: boolean;
  buttonTitle?: string | React.ReactNode;
  style?: StyleProp<ViewStyle>;
  modalHeight?: DimensionValue;
  buttonStyle?: StyleProp<ViewStyle>;
}

const ModalOption = ({ children, title, buttonTitle = t('event.options'), style, onCloseProps, isOpenProps, modalHeight = '80%', buttonStyle }: ModalOptionProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = isOpenProps !== undefined ? isOpenProps : internalOpen;

  const toggleOpen = () => {
    if (onCloseProps) {
      onCloseProps(!isOpen);
    } else {
      setInternalOpen(!isOpen);
    }
  };

  return (
    <Box>
      <Button
        onPress={toggleOpen}
        className="justify-between rounded-lg"
        style={[
          {
            backgroundColor: Colors.main.cardBackground,
            height: 60,
          },
          buttonStyle,
        ]}
      >
        <Text style={{ color: Colors.main.textPrimary }}>{buttonTitle}</Text>
        <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} size="md" color={Colors.main.textSecondary} />
      </Button>

      <Modal isVisible={isOpen} onBackdropPress={toggleOpen} onSwipeComplete={toggleOpen} swipeDirection="down" style={{ justifyContent: 'flex-end', margin: 0 }}>
        <Box style={{ backgroundColor: Colors.main.background, height: modalHeight }}>
          <Box style={styles.modalHeader}>
            <TouchableOpacity onPress={toggleOpen}>
              <Text style={styles.cancelButton}>{t('event.close')}</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{title}</Text>
            <Box style={styles.placeholder} />
          </Box>
          <View
            style={[
              {
                backgroundColor: Colors.main.background,
                borderRadius: 12,
                maxHeight: '90%',
              },
              style,
            ]}
          >
            {children}
          </View>
        </Box>
      </Modal>
    </Box>
  );
};

export default ModalOption;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.main.border,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    marginBottom: 10,
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.main.primary,
  },
  modalTitle: {
    fontSize: 18,
    color: Colors.main.textPrimary,
  },
  placeholder: {
    width: 50,
  },
});
