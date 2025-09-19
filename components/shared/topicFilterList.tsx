import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { Category } from '@/constants/Category';
import { Link } from 'expo-router';
import { AddIcon } from '@/components/ui/icon';
import { Topic } from '@/types/database-type';
import { TodoIcon } from '@/assets/Icons/TodoIcon';

interface Props {
  topics: Topic[];
  selectedTopicId: string | number;
  onSelect: (id: string) => void;
}

const TopicFilter: React.FC<Props> = ({ topics, selectedTopicId, onSelect }) => {
  const data = useMemo(() => [{ id: 'ALL', type: 'all' }, ...topics.map((item) => ({ ...item, type: 'topic' }))], [topics]);
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item.type === 'all') {
        const isSelected = selectedTopicId === '0';
        return (
          <Button onPress={() => onSelect('0')} className="w-12 mx-3 rounded-lg" style={{ backgroundColor: isSelected ? Colors.main.button + 40 : 'transparent' }}>
            <TodoIcon color={isSelected ? Colors.main.primary : Colors.main.border} />
          </Button>
        );
      }

      const isSelected = selectedTopicId === item.id;
      const categoryEntry = Category[item.category as keyof typeof Category];
      const color = categoryEntry && typeof categoryEntry === 'object' && 'color' in categoryEntry ? categoryEntry.color : Colors.main.textSecondary;

      return (
        <Button onPress={() => onSelect(item.id)} style={[styles.topicItem, { backgroundColor: isSelected ? color + 50 : 'transparent' }]} className="px-2 rounded-xl">
          <Text style={[styles.topicText, { color: isSelected ? Colors.main.textPrimary : Colors.main.textSecondary }]}>{isSelected ? item.title : truncateText(item.title, 6)}</Text>
        </Button>
      );
    },
    [selectedTopicId, onSelect],
  );

  return (
    <HStack className="border-b-[1px] pb-1 mt-4 mb-3 justify-between items-center" style={{ borderColor: Colors.main.border }}>
      <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={false} />

      <Link href={"/tabs/(tabs)/topics/createTopics"} className="p-2 w-10 h-10 mx-3 rounded-xl" style={{ backgroundColor: Colors.main.cardBackground }}>
        <AddIcon color={Colors.main.textPrimary} />
      </Link>
    </HStack>
  );
};

const styles = StyleSheet.create({
  topicItem: {
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 9,
  },
  topicText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default TopicFilter;
