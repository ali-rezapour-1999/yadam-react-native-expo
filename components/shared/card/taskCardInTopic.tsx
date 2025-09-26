import { StyleSheet } from 'react-native';
import { Text } from '../../Themed';
import { Button } from '../../ui/button';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Task } from '@/types/database-type';
import { Icon } from '../../ui/icon';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import { useAppStore } from '@/store/appState';

interface TaskCardInTopicProps {
  data: Task;
}

const TaskCardInTopic: React.FC<TaskCardInTopicProps> = ({ data }) => {
  const language = useAppStore((state) => state.language);
  return (
    <Button onPress={() => router.push(`/tabs/(tabs)/tasks/${data!.id}`)} style={styles.container} className="flex justify-between items-center h-max rounded-lg py-3 mt-3">
      <Text style={{ color: Colors.main.textPrimary }}>{data.title}</Text>
      <Icon as={language === 'fa' ? ChevronLeftIcon : ChevronRightIcon} size="lg" color={Colors.main.textPrimary} />
    </Button>
  );
};

export default TaskCardInTopic;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.border,
  },
});
