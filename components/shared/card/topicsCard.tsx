import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TaskIcon } from '@/assets/Icons/TaskIcon';
import { Category } from '@/constants/Category';
import { Link } from 'expo-router';
import { useAppStore } from '@/store/appState';
import { Text } from '../../Themed';
import { TopicWithCount } from '@/types/database-type';
import { Box } from '@/components/ui/box';

type TopicsCardProps = {
  color?: string;
  data?: TopicWithCount;
  inExplore?: boolean;
};

const TopicsCard: React.FC<TopicsCardProps> = ({ data, inExplore = false }) => {
  const { language } = useAppStore();
  const category = Category.find((c) => c.id == data?.categoryId);

  return (
    <Link href={`/tabs/(tabs)/topics/detail/${data?.id}?inExplore=${inExplore}`} style={styles.container}>
      <Box style={[styles.gradient, { backgroundColor: category!.color + 20 }]}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {data?.title || 'Untitled Topic'}
            </Text>
            {data?.description && (
              <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                {data.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.categoryTag, { backgroundColor: Colors.main.textPrimary }]}>
            <Text style={[styles.categoryText, { color: category?.color }]}>{language === 'fa' ? category?.fa : category?.name}</Text>
          </View>

          <View style={styles.taskCounter}>
            <TaskIcon color={Colors.main.textSecondary} size={20} />
            <Text style={styles.taskCount}>{data?.tasksCount || null}</Text>
          </View>
        </View>
      </Box>
    </Link>
  );
};

export default TopicsCard;

const styles = StyleSheet.create({
  container: {
    height: 130,
    width: '100%',
    marginVertical: 4,
  },
  gradient: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    width: '100%',
    height: '100%',
    borderColor: Colors.main.border,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    color: Colors.main.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: Colors.main.textSecondary,
    lineHeight: 20,
    opacity: 0.8,
  },
  categoryBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexShrink: 1,
  },
  categoryText: {
    fontSize: 12,
  },
  taskCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  taskCount: {
    fontSize: 16,
    color: Colors.main.textSecondary,
  },
});
