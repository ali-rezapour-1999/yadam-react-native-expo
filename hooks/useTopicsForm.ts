import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { router } from 'expo-router';
import { AddTopicSchemaType, addTopicSchema } from '@/components/schema/addTopicSchema';
import { Topic } from '@/types/database-type';
import { useFocusEffect } from '@react-navigation/native';
import { useGenerateNumericId } from './useGenerateId';
import { useLocalChangeTopicStore } from '@/store/topicState/localChange';
import { useUserState } from '@/store/authState/userState';

interface Props {
  topic: Topic | null;
}

export const useTopicsForm = ({ topic }: Props) => {
  const { createTopic, updateTopic } = useLocalChangeTopicStore();
  const user = useUserState.getState().user;
  const isEditMode = Boolean(topic?.id);
  const id = useGenerateNumericId()

  const form = useForm<AddTopicSchemaType>({
    resolver: zodResolver(addTopicSchema),
    defaultValues: {
      title: topic?.title || '',
      description: topic?.description || '',
      categoryId: topic?.categoryId || '',
      createdAt: topic?.createdAt || new Date().toISOString(),
      updatedAt: topic?.updatedAt || new Date().toISOString(),
      likes: topic?.likes || 0,
      isPublic: topic?.isPublic || false,
      isDeleted: topic?.isDeleted || false,
    },
    mode: 'onSubmit',
  });

  const { reset } = form;

  useFocusEffect(
    useCallback(() => {
      if (isEditMode && topic) {
        reset({
          title: topic.title,
          description: topic.description || '',
          categoryId: topic.categoryId,
          createdAt: topic.createdAt,
          updatedAt: new Date().toISOString(),
          likes: topic.likes ?? 0,
          isPublic: topic.isPublic ?? false,
          isDeleted: topic.isDeleted || false,
        });
      } else {
        const now = new Date();
        reset({
          title: '',
          description: '',
          categoryId: '',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          likes: 0,
          isPublic: false,
          isDeleted: false,
        });
      }
    }, [reset, topic, isEditMode]),
  );

  const onSubmit = useCallback(
    async (data: AddTopicSchemaType) => {
      try {
        const topicData: Topic = {
          id: isEditMode ? topic!.id : id,
          userId: (user?.id as string) || '0',
          title: data.title.trim(),
          description: data.description?.trim() || '',
          categoryId: data.categoryId ?? '',
          createdAt: data.createdAt,
          updatedAt: new Date().toISOString(),
          likes: data.likes ?? 0,
          isPublic: data.isPublic ?? false,
          status: 'ACTIVE',
          isDeleted: data.isDeleted || false,
          parentId: data.paretnId || '',
        };

        if (isEditMode) {
          await updateTopic(topicData).then(() => {
            router.push(`/tabs/(tabs)/topics/detail/${topic!.id}`);
          });
        } else {
          await createTopic(topicData).then((res) => {
            router.push(`/tabs/(tabs)/topics/detail/${res.id}`);
            reset();
          });
        }
      } catch (error) {
        console.error('Error submitting topic:', error);
      }
    },
    [reset, user, topic, isEditMode, createTopic, updateTopic],
  );

  return {
    form,
    onSubmit,
    isEditMode,
  };
};
