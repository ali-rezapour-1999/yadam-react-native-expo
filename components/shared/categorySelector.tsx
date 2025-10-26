import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, I18nManager } from 'react-native';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { HStack } from '../ui/hstack';
import { Text } from '../Themed';
import { Button } from '../ui/button';
import { useBaseStore } from '@/store/baseState/base';
import { LanguageEnum } from '@/constants/enums/base';
import AppDrower from '../common/appDrower';

export interface Category {
  id: string;
  name: string;
  fa: string;
  color?: string;
  icon?: string;
}

export interface CategoryPickerProps {
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
  categories: Category[];
  style?: any;
  error: any;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ selectedCategory, onCategorySelect, error, categories, style }) => {
  const language = useBaseStore().language;
  const [isOpen, setIsOpen] = useState(false);

  const handleCategorySelect = (category: string) => {
    onCategorySelect(category);
    setIsOpen(false);
  };

  const categoryName = categories.find((category) => category.id === selectedCategory);

  const categoryNameAndIcons = () => (
    <HStack className="gap-3">
      {categoryName?.icon && <Text className="text-xl">{categoryName?.icon}</Text>}
      <Text style={styles.categoryText}>{language === 'fa' ? categoryName?.fa : categoryName?.name}</Text>
    </HStack>
  );

  const renderCategoryItem = useCallback(
    ({ item }: { item: Category }) => (
      <Button
        style={[
          styles.categoryItem,
          item.id === selectedCategory && styles.selectedCategoryItem,
          {
            flexDirection: language == LanguageEnum.FA ? 'row' : 'row-reverse',
          },
        ]}
        onPress={() => handleCategorySelect(item.id)}
      >
        <HStack className="items-center gap-3">
          {item.color && <View style={[styles.categoryColorIndicator, { backgroundColor: item.color }]} />}
          <Text style={[styles.categoryText, item.id === selectedCategory && styles.selectedCategoryText]}>{language == LanguageEnum.FA ? item.fa : item.name}</Text>
        </HStack>
        {item.icon && <Text style={styles.categoryIcon}>{item.icon}</Text>}
      </Button>
    ),
    [selectedCategory, language, error],
  );

  return (
    <View style={style}>
      <AppDrower
        title={error ? error.message : t('category.select_category_type')}
        trigger={<Text>{selectedCategory ? categoryNameAndIcons() : t('category.select_category_type')}</Text>}
        onToggle={setIsOpen}
        isOpen={isOpen}
        triggerStyle={{
          borderWidth: error ? 2 : 0,
          borderColor: error ? Colors.main.accent : Colors.main.cardBackground,
          backgroundColor: error ? Colors.main.accent + 30 : Colors.main.cardBackground,
          padding: 20,
        }}
        showHeaderButton={false}
        style={{ height: "80%", paddingBottom: 70 }}
      >
        <FlatList data={categories} keyExtractor={(item) => item.id} renderItem={renderCategoryItem} style={styles.categoryList} />
      </AppDrower>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    backgroundColor: Colors.main.cardBackground,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
    height: 50,
  },
  selectedCategoryItem: {
    backgroundColor: Colors.main.primary + 10,
    borderWidth: 1,
    borderColor: Colors.main.primary,
  },
  categoryColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: I18nManager.isRTL ? 0 : 12,
    marginLeft: I18nManager.isRTL ? 12 : 0,
  },
  categoryText: {
    fontSize: 16,
    color: Colors.main.textPrimary || '#000000',
  },
  selectedCategoryText: {
    color: Colors.main.primary || '#007AFF',
  },
  categoryIcon: {
    fontSize: 18,
  },
});

export default CategoryPicker;
