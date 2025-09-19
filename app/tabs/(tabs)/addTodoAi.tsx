import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Prompt } from '@/constants/Prompt';

const AddTodoAi = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Box className="flex-1 px-4" style={{ backgroundColor: Colors.main.background }}>
      <Heading size="2xl" className="text-center mt-5" style={{ color: Colors.main.textPrimary }}>
        Add Todo with AI
      </Heading>

      <Button onPress={() => router.push('/tabs/(wizardForm)')} className="rounded-2xl py-3 h-16 px-1 mt-5">
        <ButtonText className="text-xl">Create schedule with default questions</ButtonText>
      </Button>

      <VStack className="mt-10">
        <Text className="text-xl">Use prompts to create a schedule</Text>

        <VStack space="md" className="mt-4">
          {Prompt.map((prompt) => (
            <Button
              className="rounded-lg h-12"
              style={{ backgroundColor: prompt.id === selected ? Colors.main.button : Colors.main.cardBackground }}
              onPress={() => setSelected(prompt.id)}
              key={prompt.id}
            >
              <ButtonText style={{ color: Colors.main.textPrimary }} className="text-lg">
                {prompt.title}
              </ButtonText>
            </Button>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default AddTodoAi;
