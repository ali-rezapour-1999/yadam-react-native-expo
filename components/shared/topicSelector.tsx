import React from 'react';
import { View, FlatList, TouchableOpacity, I18nManager, Platform, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { Text } from '../Themed';
import { Box } from '../ui/box';
import { Topic } from '@/types/database-type';
import { Button } from '../ui/button';

interface TopicItemProps {
  item: Topic;
  onSelect: () => void;
  isSelected: boolean;
}

interface TopicSelectorProps {
  visible: boolean;
  onClose: () => void;
  topics: Topic[];
  selectedTopicId?: string;
  onSelectTopic: (id: string) => void;
}

const TopicItem: React.FC<TopicItemProps> = ({ item, onSelect, isSelected }) => (
  <TouchableOpacity
    onPress={onSelect}
    style={[styles.topicItem, isSelected && styles.topicItemSelected]}
  >
    <Text style={[styles.topicText, isSelected && styles.topicTextSelected]}>
      {item.title}
    </Text>
  </TouchableOpacity>
);

const TopicSelector: React.FC<TopicSelectorProps> = ({ visible, onClose, topics, selectedTopicId, onSelectTopic, }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      backdropTransitionOutTiming={0}
      propagateSwipe
      style={styles.modalWrapper}
    >
      <Box style={styles.sheetContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.titleText}>{t('event.select_topics')}</Text>
          <Button onPress={onClose}>
            <Text style={styles.cancelText}>{t('common.button.confirm')}</Text>
          </Button>
        </View>

        {/* Topic List */}
        <FlatList
          data={topics}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TopicItem
              item={item}
              isSelected={selectedTopicId === item.id}
              onSelect={() => {
                onSelectTopic(item.id);
                onClose();
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContainer}
        />
      </Box>
    </Modal>
  );
};

export default TopicSelector;

/**
 * ------------------------------------------------------------
 * Styles
 * ------------------------------------------------------------
 */
const styles = StyleSheet.create({
  modalWrapper: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheetContainer: {
    backgroundColor: Colors.main.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 8,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.main.border,
  },
  headerRow: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: Colors.main.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.main.primary,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.main.textPrimary,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  topicItem: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.main.border,
  },
  topicItemSelected: {
    borderColor: Colors.main.primary,
    backgroundColor: `${Colors.main.primary}10`,
  },
  topicText: {
    fontSize: 16,
    color: Colors.main.textPrimary,
  },
  topicTextSelected: {
    color: Colors.main.primary,
    fontWeight: '600',
  },
});
