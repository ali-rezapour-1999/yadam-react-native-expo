import React from 'react';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { useWizardStore } from '@/store/wizardFormState';
import { Box } from '../ui/box';
import { Text } from '../Themed';

const WizardStepper = () => {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const stepLabels = [
    t('onboarding.Information'),
    t('onboarding.Goal'),
    t('onboarding.Lifestyle'),
    t('onboarding.Priority'),
  ];
  const { step: currentStep } = useWizardStore();

  const isRTL = language === 'fa';

  return (
    <Box className="w-full px-6 py-4 mb-2">
      <Box
        className="absolute h-0.5 z-0"
        style={{
          top: '50%',
          left: '15%',
          right: '15%',
          backgroundColor: Colors.main.primaryLight,
          opacity: 0.3,
        }}
      />

      <MotiView
        from={{ width: 0 }}
        animate={{
          width: `${((currentStep - 1) / (stepLabels.length - 1)) * 70}%`,
        }}
        transition={{
          type: 'timing',
          duration: 600,
        }}
        style={{
          position: 'absolute',
          top: '50%',
          [isRTL ? 'right' : 'left']: '17%',
          height: 2,
          backgroundColor: Colors.main.primary,
          zIndex: 0,
          transform: [{ scaleX: isRTL ? -1 : 1 }],
        }}
      />

      <Box
        className="relative flex-row items-center justify-between z-10"
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        {stepLabels.map((stepLabel, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = index === stepLabels.length - 1;

          return (
            <Box key={index} className="flex-1 items-center">
              <Box className="relative items-center">
                <MotiView
                  from={{ scale: 0.8, opacity: 0.7 }}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    opacity: 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isCompleted || isActive ? Colors.main.primary : Colors.main.textPrimary,
                    shadowColor: Colors.main.primary,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: isActive ? 0.3 : 0.1,
                    shadowRadius: isActive ? 6 : 3,
                    elevation: isActive ? 3 : 0,
                  }}
                >
                  {isCompleted ? (
                    <MotiView
                      from={{ scale: 0, rotate: '-180deg' }}
                      animate={{ scale: 1, rotate: '0deg' }}
                      transition={{
                        type: 'spring',
                        delay: 150,
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <Ionicons name="checkmark" size={20} color={Colors.main.textPrimary} />
                    </MotiView>
                  ) : (
                    <MotiView
                      from={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                      }}
                    >
                      <Text
                        className="text-base font-bold"
                        style={{
                          color: isActive ? Colors.main.textPrimary : Colors.main.cardBackground,
                        }}
                      >
                        {stepNumber}
                      </Text>
                    </MotiView>
                  )}
                </MotiView>

                <MotiView
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{
                    opacity: isActive ? 1 : 0.7,
                    translateY: 0,
                  }}
                  transition={{
                    duration: 300,
                    delay: 100,
                  }}
                  style={{ marginTop: 8 }}
                >
                  <Text
                    className="text-xs text-center font-medium"
                    style={{
                      color: isActive ? Colors.main.primary : Colors.main.textSecondary,
                      fontWeight: isActive ? '600' : '400',
                      writingDirection: isRTL ? 'rtl' : 'ltr',
                    }}
                  >
                    {stepLabel}
                  </Text>
                </MotiView>
              </Box>

              {!isLast && (
                <Box
                  className="absolute h-0.5"
                  style={{
                    top: 15,
                    [isRTL ? 'right' : 'left']: '60%',
                    [isRTL ? 'left' : 'right']: '10%',
                    zIndex: -1,
                  }}
                >
                  <Box
                    className="absolute w-full h-full rounded-full"
                    style={{
                      backgroundColor: 'transparent',
                    }}
                  />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default WizardStepper;
