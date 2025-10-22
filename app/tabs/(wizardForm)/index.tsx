import { Text } from "@/components/Themed";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Colors } from "@/constants/Colors";
import { Link, router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

const WizardForm = () => {
  const { t } = useTranslation();
  return (
    <Box
      className="flex-1 flex justify-between"
      style={{ direction: "ltr", backgroundColor: Colors.main.background }}
    >
      <Box
        className="h-1/2 rounded-b-[40] pb-5 flex justify-center px-10"
        style={{
          backgroundColor: Colors.main.cardBackground,
        }}
      >
        <Heading className="text-white" size="3xl">
          {t("onboarding.getting_started")}
        </Heading>
        <Heading className="text-white mt-.5" size="xl">
          {t("onboarding.start_your_journey_with_ding")}
        </Heading>
        <Text className="mt-3 text-background text-lg">
          {t("onboarding.intro_message")}
        </Text>
        <Text className="mt-5 text-background text-lg">
          {t("onboarding.takes_less_than_a_minute")}
        </Text>
        <Text className="text-background text-lg mt-3">
          {t("onboarding.our_goal")}
        </Text>
      </Box>
      <Box className="px-4 mb-10 space-2">
        <Button
          style={{ backgroundColor: Colors.main.button }}
          className="border-b-1 rounded-[15px] h-[55px] font-bold"
          onPress={() => router.push("/tabs/stepOne")}
        >
          <Text className="text-white text-2xl font-ibmpBold">
            {t("onboarding.lets_do_it")}
          </Text>
        </Button>
        <Link href="/tabs/(tabs)" className="border-b-1 mt-5 text-center">
          <Text style={{ color: Colors.main.textPrimary }} className="text-lg">
            {t("onboarding.skip")}
          </Text>
        </Link>
      </Box>
    </Box>
  );
};

export default WizardForm;
