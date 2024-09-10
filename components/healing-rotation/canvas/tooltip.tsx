import React from "react";
import { Group, Rect, Text } from "react-konva";
import { Portal } from "react-konva-utils";

interface IProps {
  text: string;
  x: number;
  y: number;
  elementWidth: number;
  isVisible: boolean;
  type: TooltipType;
}

type TooltipType = "error" | "warning" | "success";

const COLORS = {
  error: "#FF003C", // Vibrant red for errors
  success: "#00C851", // Vibrant green for success
  warning: "#FFBB33", // Bold amber for warnings
};

const KonvaTooltip = ({
  text,
  x,
  y,
  elementWidth,
  isVisible,
  type,
}: IProps) => {
  const padding = 5;
  const width = text.length * 7 + padding * 2;

  return (
    isVisible && (
      <Portal selector=".top-layer" enabled={isVisible}>
        <Group x={x + elementWidth + padding} y={y}>
          <Rect width={width} height={20 + padding * 2} fill={COLORS[type]} />
          <Text
            text={text}
            x={padding + 4}
            y={padding + 4}
            fontSize={14}
            fill="white"
          />
        </Group>
      </Portal>
    )
  );
};

export default KonvaTooltip;
