import { View, FlatList, TouchableOpacity, I18nManager, Platform, StyleSheet } from 'react-native';
import { HStack } from '../ui/hstack';
import { Colors } from '@/constants/Colors';
import { Text } from '../Themed';
import { t } from 'i18next';
import { Box } from '../ui/box';
import { Topic } from '@/types/database-type';
import Modal from 'react-native-modal';

interface TopicItemProps {
  item: Topic;
  onSelect: () => void;
  isSelected: boolean;
}

interface TopicSelectorProps {
  visible: boolean;
  onClose: () => void;
  topics: Topic[];
  selectedTopicId: string | undefined;
  onSelectTopic: (id: string) => void;
}

const TopicItem: React.FC<TopicItemProps> = ({ item, onSelect, isSelected }) => (
  <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
    <HStack className="items-center gap-3" style={[styles.topicItem, isSelected && styles.topicItemSelected]}>
      <Text>{item.title}</Text>
    </HStack>
  </TouchableOpacity>
);

const TopicSelector = ({ visible, onClose, topics, selectedTopicId, onSelectTopic }: TopicSelectorProps) => (
  <Modal isVisible={visible} onBackdropPress={onClose} onSwipeComplete={onClose} swipeDirection="down" style={{ justifyContent: 'flex-end', margin: 0, minHeight: '80%' }}>
    <Box style={styles.modalContainer}>
      <Box style={styles.modalHeader}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelButton}>{t('event.close')}</Text>
        </TouchableOpacity>
        <Text style={styles.modalTitle}>{t('category.select_category')}</Text>
        <Box style={styles.placeholder} />
      </Box>
      <View
        style={{
          backgroundColor: Colors.main.background,
          borderRadius: 12,
          maxHeight: '80%',
          padding: 16,
        }}
      >
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
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </Box>
  </Modal>
);

export default TopicSelector;

const styles = StyleSheet.create({
  topicItem: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowRadius: 1,
    borderWidth: 1,
    borderColor: Colors.main.border,
  },
  topicItemSelected: {
    borderWidth: 2,
    borderColor: Colors.main.primary,
    elevation: 2,
  },
  modalContainer: {
    backgroundColor: Colors.main.background || '#FFFFFF',
    height: '80%',
  },
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
    fontWeight: '600',
    color: Colors.main.textPrimary,
  },
  placeholder: {
    width: 50,
  },
});
