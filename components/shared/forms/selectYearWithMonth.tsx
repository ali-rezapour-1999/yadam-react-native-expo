import React from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { Drawer, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody } from '@/components/ui/drawer';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import { Box } from '@/components/ui/box';
import { useAppStore } from '@/store/appState';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import CalenderIcon from '@/assets/Icons/CalenderIcon';
import { Text } from 'react-native';
import jalaliMoment from 'jalali-moment';
import { Icon } from '@/components/ui/icon';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react-native';

interface MonthOption {
  value: string;
  labelEn: string;
  labelFa: string;
}

interface SelectYearWithMonthProps {
  selectedYear: string | null;
  setSelectedYear: React.Dispatch<React.SetStateAction<string | null>>;
  selectedMonth: string | null;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string | null>>;
}

const gregorianMonths: MonthOption[] = [
  { value: '1', labelEn: 'January', labelFa: 'ژانویه' },
  { value: '2', labelEn: 'February', labelFa: 'فوریه' },
  { value: '3', labelEn: 'March', labelFa: 'مارس' },
  { value: '4', labelEn: 'April', labelFa: 'آوریل' },
  { value: '5', labelEn: 'May', labelFa: 'مه' },
  { value: '6', labelEn: 'June', labelFa: 'ژوئن' },
  { value: '7', labelEn: 'July', labelFa: 'جولای' },
  { value: '8', labelEn: 'August', labelFa: 'اوت' },
  { value: '9', labelEn: 'September', labelFa: 'سپتامبر' },
  { value: '10', labelEn: 'October', labelFa: 'اکتبر' },
  { value: '11', labelEn: 'November', labelFa: 'نوامبر' },
  { value: '12', labelEn: 'December', labelFa: 'دسامبر' },
];

const jalaliMonths: MonthOption[] = [
  { value: '1', labelEn: 'Farvardin', labelFa: 'فروردین' },
  { value: '2', labelEn: 'Ordibehesht', labelFa: 'اردیبهشت' },
  { value: '3', labelEn: 'Khordad', labelFa: 'خرداد' },
  { value: '4', labelEn: 'Tir', labelFa: 'تیر' },
  { value: '5', labelEn: 'Mordad', labelFa: 'مرداد' },
  { value: '6', labelEn: 'Shahrivar', labelFa: 'شهریور' },
  { value: '7', labelEn: 'Mehr', labelFa: 'مهر' },
  { value: '8', labelEn: 'Aban', labelFa: 'آبان' },
  { value: '9', labelEn: 'Azar', labelFa: 'آذر' },
  { value: '10', labelEn: 'Dey', labelFa: 'دی' },
  { value: '11', labelEn: 'Bahman', labelFa: 'بهمن' },
  { value: '12', labelEn: 'Esfand', labelFa: 'اسفند' },
];

const SelectYearWithMonth: React.FC<SelectYearWithMonthProps> = ({ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }) => {
  const { language, calender } = useAppStore();
  const [showDrawer, setShowDrawer] = React.useState(false);

  const currentYear = calender === 'jalali' ? jalaliMoment().jYear().toString() : jalaliMoment().year().toString();
  const [year, setYear] = React.useState<number>(parseInt(currentYear));

  React.useEffect(() => {
    setSelectedYear(year.toString());
  }, [year, setSelectedYear]);

  const handleDecrease = React.useCallback(() => {
    setYear((prev) => prev - 1);
  }, []);

  const handleIncrease = React.useCallback(() => {
    setYear((prev) => prev + 1);
  }, []);

  const handleMonthSelect = React.useCallback(
    (monthValue: string) => {
      setSelectedMonth(monthValue);
    },
    [setSelectedMonth],
  );

  const handleDrawerClose = React.useCallback(() => {
    setShowDrawer(false);
  }, []);

  const months = React.useMemo(() => {
    return calender === 'jalali' ? jalaliMonths : gregorianMonths;
  }, [calender]);

  const displayYear = React.useMemo(() => {
    return calender === 'jalali' ? jalaliMoment(`${year}`, 'jYYYY').format('jYYYY') : year.toString();
  }, [calender, year]);

  const selectedMonthLabel = React.useMemo(() => {
    return selectedMonth ? months.find((m) => m.value === selectedMonth) : null;
  }, [selectedMonth, months]);

  const buttonText = React.useMemo(() => {
    if (selectedYear && selectedMonth && selectedMonthLabel) {
      const monthText = language === 'fa' ? `${selectedMonthLabel.labelFa} - ${selectedMonthLabel.labelEn}` : `${selectedMonthLabel.labelEn} - ${selectedMonthLabel.labelFa}`;
      return `${displayYear} | ${monthText}`;
    }
    return t('select_year_month');
  }, [selectedYear, selectedMonth, selectedMonthLabel, displayYear, language]);

  return (
    <>
      <Button onPress={() => setShowDrawer(true)} className="rounded-xl" style={{ backgroundColor: Colors.main.cardBackground }}>
        <HStack className="items-center" space="sm">
          <CalenderIcon />
          <ButtonText
            className="text-md"
            style={{
              color: selectedYear && selectedMonth ? Colors.main.textSecondary : Colors.main.primaryLight,
            }}
          >
            {buttonText}
          </ButtonText>
        </HStack>
      </Button>

      <Drawer isOpen={showDrawer} onClose={handleDrawerClose} size="sm" anchor="bottom" className="bg-black/80 border-0">
        <DrawerBackdrop />
        <DrawerContent style={{ backgroundColor: Colors.main.cardBackground }} className="h-max rounded-t-[40px] border-0">
          <DrawerHeader className="justify-center py-1">
            <HStack className="items-center gap-10 mb-4">
              <Button onPress={handleDecrease} className={`rounded-lg`} style={{ backgroundColor: Colors.main.border, height: 40 }}>
                <Icon as={language === 'en' ? ArrowLeftIcon : ArrowRightIcon} size="xl" color={Colors.main.textPrimary} />
              </Button>

              <Text style={{ fontSize: 24, color: Colors.main.textPrimary }}>{displayYear}</Text>

              <Button onPress={handleIncrease} className={`rounded-lg`} style={{ backgroundColor: Colors.main.border, height: 40 }}>
                <Icon as={language === 'en' ? ArrowRightIcon : ArrowLeftIcon} size="xl" color={Colors.main.textPrimary} />
              </Button>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack className="items-center space-y-6">
              <Box
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {months.map((option) => (
                  <Button
                    key={option.value}
                    onPress={() => handleMonthSelect(option.value)}
                    variant={selectedMonth === option.value ? 'solid' : 'outline'}
                    className="h-12 rounded-xl mb-2"
                    style={{
                      backgroundColor: selectedMonth === option.value ? Colors.main.primary : Colors.main.background,
                      borderWidth: 0,
                      flexBasis: '32%',
                    }}
                  >
                    <ButtonText
                      className="text-lg"
                      style={{
                        color: selectedMonth === option.value ? Colors.main.textPrimary : Colors.main.textSecondary,
                        textAlign: 'center',
                      }}
                    >
                      {language === 'fa' ? option.labelFa : option.labelEn}
                    </ButtonText>
                  </Button>
                ))}
              </Box>

              <Button onPress={handleDrawerClose} className="mt-4 h-14 rounded-xl w-full" style={{ backgroundColor: Colors.main.button }}>
                <ButtonText className="text-white text-lg">{t('button.confirm')}</ButtonText>
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SelectYearWithMonth;
