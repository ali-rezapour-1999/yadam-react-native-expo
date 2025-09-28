import React from "react";
import { View, ViewProps } from "react-native";

import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import { boxStyle } from "./styles";
import { useStaticDynamicStyle } from "@/hooks/useDynamicStyle";

type IBoxProps = ViewProps &
  VariantProps<typeof boxStyle> & { className?: string };

const Box = React.forwardRef<React.ComponentRef<typeof View>, IBoxProps>(
  function Box({ className, ...props }, ref) {
    const dirStyle = useStaticDynamicStyle(props.style);

    return (
      <View
        ref={ref}
        {...props}
        className={boxStyle({ class: className })}
        style={dirStyle}
      />
    );
  }
);

Box.displayName = "Box";
export { Box };
