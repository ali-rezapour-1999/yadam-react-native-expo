import React from "react";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import { View } from "react-native";

import { vstackStyle } from "./styles";
import { useStaticDynamicStyle } from "@/hooks/useDynamicStyle";

type IVStackProps = React.ComponentProps<typeof View> &
  VariantProps<typeof vstackStyle>;

const VStack = React.forwardRef<React.ComponentRef<typeof View>, IVStackProps>(
  function VStack({ className, space, ...props }, ref) {
    const dirStyle = useStaticDynamicStyle(props.style);

    return (
      <View
        className={vstackStyle({
          space: space,
          class: className,
        })}
        {...props}
        ref={ref}
        style={dirStyle}
      />
    );
  }
);

VStack.displayName = "VStack";

export { VStack };
