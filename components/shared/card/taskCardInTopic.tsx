import { StyleSheet } from 'react-native';
import { Text } from '../../Themed';
import { Button } from '../../ui/button';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Task } from '@/types/database-type';
import { Icon } from '../../ui/icon';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import { useBaseStore } from '@/store/baseState/base';
import { LanguageEnum } from '@/constants/enums/base';

interface TaskCardInTopicProps {
  data: Task;
}

const TaskCardInTopic: React.FC<TaskCardInTopicProps> = ({ data }) => {
  const language = useBaseStore().language;
  return (
    <Button onPress={() => router.push(`/tabs/(tabs)/tasks/${data.id}`)} style={styles.container} className="flex justify-between items-center h-max rounded-lg py-3 mt-3">
      <Text style={{ color: Colors.main.textPrimary }}>{data.title}</Text>
      <Icon as={language === LanguageEnum.FA ? ChevronLeftIcon : ChevronRightIcon} size="lg" color={Colors.main.textPrimary} />
    </Button>
  );
};

export default TaskCardInTopic;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.border,
  },
});
