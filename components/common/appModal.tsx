import { Platform, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Text } from '../Themed';
import { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody } from '../ui/modal';

interface AppModalProps {
  children: React.ReactNode;
  title: string;
  onCloseProps?: (isOpen: boolean) => void;
  isOpenProps?: boolean;
  buttonContent?: React.ReactNode;
  rootModalStyle?: StyleProp<ViewStyle>;
  modalContentStyle?: StyleProp<ViewStyle>;
  modalBodyStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}

const AppModal = ({
  children,
  title,
  ...props
}: AppModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = props.isOpenProps !== undefined;
  const isOpen = isControlled ? props.isOpenProps : internalOpen;

  const toggleOpen = useCallback(() => {
    if (isControlled && props.onCloseProps) {
      props.onCloseProps(!isOpen);
    } else {
      setInternalOpen(prev => !prev);
    }
  }, [isControlled, isOpen, props.onCloseProps]);

  return (
    <>
      <Button
        onPress={toggleOpen}
        accessibilityLabel="Open modal"
        className="rounded-lg w-full"
        style={props.buttonStyle}
      >
        {props.buttonContent}
      </Button>

      {isOpen && (
        <Modal isOpen={isOpen} style={[styles.modalRoot, props.rootModalStyle]} onClose={toggleOpen}>
          <ModalBackdrop onPress={toggleOpen} style={{ backgroundColor: "#000000" }} />
          <ModalContent style={[styles.modalContent, props.modalContentStyle]}>
            <ModalHeader style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
            </ModalHeader>
            <ModalBody style={props.modalBodyStyle}>
              {children}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  modalRoot: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: 0,
  },
  modalHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.main.border,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: Colors.main.textPrimary,
  },
  modalContent: {
    backgroundColor: Colors.main.background,
    borderRadius: 12,
    minHeight: '20%',
    minWidth: '80%',
  },
});
