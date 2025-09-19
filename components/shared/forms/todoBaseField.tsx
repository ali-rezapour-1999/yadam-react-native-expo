import React, { Dispatch, SetStateAction } from 'react';
import { Controller, Control } from 'react-hook-form';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { t } from 'i18next';
import { AddTodoSchemaType } from '@/components/schema/addTodoSchema';
import DatePicker from '@/components/common/datePicker';
import { TimePicker } from '@/components/common/timePicker';
import TimeDeffrence from '@/components/common/timeDeffrence';
import { AddTodoForm } from './addTodo/todoForm';
import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

interface TodoBasicFieldsProps {
  control: Control<AddTodoSchemaType>;
  errors: any;
  startTime: string;
  endTime: string;
  showDatePicker: boolean;
  setShowDatePicker: Dispatch<SetStateAction<boolean>>;
}

export const TodoBasicFields: React.FC<TodoBasicFieldsProps> = ({ control, errors, startTime, endTime, showDatePicker, setShowDatePicker }) => {
  return (
    <>
      <Controller
        name="title"
        control={control}
        render={({ field }) => <AddTodoForm autoFocus style={{ height: 40 }} value={field.value} placeholder={t('event.title')} onChange={field.onChange} error={errors.title?.message} />}
      />

      <VStack style={styles.fieldsContainer}>
        <Controller name="date" control={control} render={({ field }) => <DatePicker field={field} setShowDatePicker={setShowDatePicker} showDatePicker={showDatePicker} />} />

        <HStack className="justify-center items-center gap-2 w-full">
          <Box style={{ alignItems: 'center' }}>
            <Controller name="startTime" control={control} render={({ field }) => <TimePicker field={field} label={t('todos.start_time')} placeholder="00:00" width="[80%]" height="12" />} />
          </Box>

          <Box style={{ alignItems: 'center' }}>
            <Controller name="endTime" control={control} render={({ field }) => <TimePicker field={field} label={t('todos.end_time')} placeholder="00:00" width="[80%]" height="12" />} />
          </Box>
        </HStack>

        {startTime && endTime && <TimeDeffrence startTime={startTime} endTime={endTime} />}
      </VStack>
    </>
  );
};

const styles = StyleSheet.create({
  fieldsContainer: {
    marginVertical: 10,
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowRadius: 2,
    gap: 20,
    elevation: 2,
  },
});
