import React, { useState, useCallback, memo } from "react";
import { TouchableOpacity, View, StyleSheet, I18nManager, StyleProp, ViewStyle, DimensionValue } from "react-native";
import Modal from "react-native-modal";
import { Colors } from "@/constants/Colors";
import { Text } from "../Themed";
import { Box } from "../ui/box";
import { VStack } from "../ui/vstack";
import ChevronDown from "@/assets/Icons/ChevronDown";
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

export const AppDrawer: React.FC<BaseDrawerProps> = memo(
  ({
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
    confirmText = t("common.button.confirm"),
  }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isOpen ?? internalOpen;

    const handleToggle = useCallback(() => {
      if (onToggle) onToggle(!open);
      else setInternalOpen(!open);
    }, [onToggle, open]);

    return (
      <>
        <TouchableOpacity
          onPress={handleToggle}
          style={[
            { backgroundColor: Colors.main.cardBackground, width: "100%" },
            triggerStyle,
          ]}
          className="h-max rounded-xl"
        >
          {trigger}
        </TouchableOpacity>

        {/* Drawer */}
        <Modal
          isVisible={open}
          onBackdropPress={handleToggle}
          onSwipeComplete={handleToggle}
          swipeDirection="down"
          backdropTransitionOutTiming={0}
          useNativeDriverForBackdrop
          style={styles.modalWrapper}
        >
          <VStack style={styles.drawerContainer}>
            <TouchableOpacity
              onPress={handleToggle}
              activeOpacity={0.7}
              style={styles.chevronWrapper}
            >
              <ChevronDown />
            </TouchableOpacity>

            {/* Box Content */}
            <Box style={style}>
              {/* Header */}
              {showHeader && (
                <View style={[styles.header, headerStyle]}>
                  <View style={styles.placeholder} />
                  <Text style={styles.title}>{title}</Text>
                  {showHeaderButton ? (
                    <TouchableOpacity onPress={handleToggle}>
                      <Text style={styles.closeText}>{confirmText}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.placeholder} />
                  )}
                </View>
              )}

              {/* Content */}
              <View
                style={[
                  styles.content,
                  { backgroundColor: Colors.main.background },
                  contentStyle,
                ]}
              >
                {children}
              </View>
            </Box>
          </VStack>
        </Modal>
      </>
    );
  }
);

export default AppDrawer;

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
    backgroundColor: Colors.main.background,
    alignItems: "center",
  },
  chevronWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.main.border,
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
    paddingBottom: 20,
  },
});
