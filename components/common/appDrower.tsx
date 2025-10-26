import React, { useState, useCallback, memo } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  I18nManager,
  StyleProp,
  ViewStyle,
  DimensionValue,
} from "react-native";
import Modal from "react-native-modal";
import { Colors } from "@/constants/Colors";
import { Text } from "../Themed";
import { Box } from "../ui/box";
import { t } from "i18next";

interface BaseDrawerProps {
  children?: React.ReactNode;
  title?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  trigger?: React.ReactNode;
  height?: DimensionValue;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  showHeader?: boolean;
  confirmText?: string;
  showHeaderButton?: boolean;
}

export const AppDrawer: React.FC<BaseDrawerProps> = memo(({
  children,
  title,
  isOpen,
  onToggle,
  trigger,
  style,
  headerStyle,
  contentStyle,
  triggerStyle,
  showHeader = true,
  showHeaderButton = true,
  confirmText = t('common.button.confirm'),
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen ?? internalOpen;

  const handleToggle = useCallback(() => {
    if (onToggle) onToggle(!open);
    else setInternalOpen(!open);
  }, [onToggle, open]);

  return (
    <>
      {/* Trigger Element */}
      <TouchableOpacity onPress={handleToggle} style={[{ backgroundColor: Colors.main.cardBackground, width: "100%" }, triggerStyle]} className="h-max rounded-2xl">
        {trigger}
      </TouchableOpacity>

      {/* Drawer Modal */}
      <Modal
        isVisible={open}
        onBackdropPress={handleToggle}
        onSwipeComplete={handleToggle}
        swipeDirection="down"
        backdropTransitionOutTiming={0}
        useNativeDriverForBackdrop
        style={styles.modalWrapper}
      >
        <Box
          style={[
            styles.drawerContainer,
            { backgroundColor: Colors.main.background },
            style,
          ]}
        >
          {/* Header */}
          {showHeader && (
            <View style={[styles.header, headerStyle]}>
              <View style={styles.placeholder} />
              <Text style={styles.title}>{title}</Text>
              {showHeaderButton ? (
                <TouchableOpacity onPress={handleToggle}>
                  <Text style={styles.closeText}>{confirmText}</Text>
                </TouchableOpacity>
              ) :
                <View style={styles.placeholder} />
              }
            </View>
          )}

          {/* Content */}
          <View style={[styles.content, { backgroundColor: Colors.main.background }, contentStyle,]}>
            {children}
          </View>
        </Box>
      </Modal>
    </>
  );
}
);

export default AppDrawer

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  modalWrapper: {
    justifyContent: "flex-end",
    margin: 0,
  },
  drawerContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.main.border,
    paddingTop: Platform.OS === "ios" ? 50 : 10,
  },
  closeText: {
    fontSize: 16,
    color: Colors.main.primary,
  },
  title: {
    fontSize: 18,
    color: Colors.main.textPrimary,
  },
  placeholder: {
    width: 50,
  },
  content: {
    paddingVertical: 20,
  },
});
