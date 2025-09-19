import React from 'react';
import { Box } from '../ui/box';
import { Input, InputField } from '../ui/input';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SearchIcons } from '@/assets/Icons/SearchIcon';
import { t } from 'i18next';
import { CloseIcon, Icon } from '../ui/icon';
import { Button } from '../ui/button';

const Search = ({ onChange, search }: { onChange: any; search: string }) => {
  return (
    <Box style={styles.container} className="mb-7 mt-3">
      <Input style={styles.inputContainer} className="rounded-lg h-16 px-3">
        <Box className="h-7 w-7">
          <SearchIcons />
        </Box>
        <InputField
          type="text"
          placeholder={t('event.search')}
          value={search}
          style={{ color: Colors.main.textPrimary }}
          onChangeText={onChange}
          className="text-lg"
          placeholderTextColor={Colors.main.textSecondary}
        />
        {search.length > 0 ? (
          <Button className="p-1 bg-transparent" onPress={() => onChange('')}>
            <Icon as={CloseIcon} size="xl" color={Colors.main.accent} />
          </Button>
        ) : null}
      </Input>
    </Box>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    backgroundColor: Colors.main.border,
    borderColor: Colors.main.border,
  },
});
