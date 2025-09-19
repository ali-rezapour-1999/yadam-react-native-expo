import React from "react";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import { View } from "react-native";
import type { ViewProps } from "react-native";
import { hstackStyle } from "./styles";
import { useStaticDynamicStyle } from "@/hooks/useDynamicStyle";

type IHStackProps = ViewProps & VariantProps<typeof hstackStyle>;

const HStack = React.forwardRef<React.ComponentRef<typeof View>, IHStackProps>(
  function HStack({ className, space, ...props }, ref) {
    const dirStyle = useStaticDynamicStyle(props.style);

    return (
      <View
        className={hstackStyle({
          space,
          class: className,
        })}
        {...props}
        ref={ref}
        style={dirStyle}
      />
    );
  }
);

HStack.displayName = "HStack";

export { HStack };
