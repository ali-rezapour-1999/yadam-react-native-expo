import { t } from 'i18next';
import { VStack } from '../ui/vstack';
import { Box } from '../ui/box';
import { Text } from '../Themed';
import NoInternetIcon from '@/assets/Icons/NoInternetIcon';
import { Colors } from '@/constants/Colors';

const NoInternetConnection = () => {
  return (
    <VStack className="flex-1 items-center justify-center">
      <Box className="w-20 h-20">
        <NoInternetIcon color={Colors.main.accent} />
      </Box>
      <Text className="text-2xl" style={{ color: Colors.main.accent }}>
        {t('event.lost_internet_connection')}
      </Text>
    </VStack>
  );
};

export default NoInternetConnection;
