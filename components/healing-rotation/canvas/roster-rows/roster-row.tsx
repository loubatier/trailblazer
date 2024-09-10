import React from "react";
import { Rect } from "react-konva";
import {
  BASE_SPACING,
  BOSS_TIMELINE_ROW_HEIGHT,
  TIMELINE_ROW_HEIGHT,
} from "../..";

interface IProps {
  width: number;
  position: number;
  isActive: boolean;
  isHovered: boolean;
}

const CanvasRow = ({
  width,
  position,
  isActive = true,
  isHovered = false,
}: IProps) => {
  const fill = isHovered ? "#191C1D" : "#151718";
  const y =
    BOSS_TIMELINE_ROW_HEIGHT + position * (TIMELINE_ROW_HEIGHT + BASE_SPACING);

  return (
    <Rect
      x={0}
      y={y}
      fill={fill}
      width={width}
      height={TIMELINE_ROW_HEIGHT}
      opacity={isActive ? 1 : 0.5}
    />
  );
};

export default CanvasRow;
