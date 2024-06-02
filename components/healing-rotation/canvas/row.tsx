import React from "react";
import { Rect } from "react-konva";
import { BASE_SPACING, TIMELINE_ROW_HEIGHT } from "../timeline-wrapper";
import { ETimelineRowType } from ".";

interface IProps {
  width: number;
  index: number;
  type: ETimelineRowType;
  isActive: boolean;
  isHovered: boolean;
}

const CanvasRow = ({ width, type, index, isActive, isHovered }: IProps) => {
  const isBossRow = type === ETimelineRowType.BOSS;
  const fill = isActive ? (isHovered ? "#2A2E34" : "#23262B") : "#23262B50";
  const bossRowY = 32;
  const rowY =
    32 +
    TIMELINE_ROW_HEIGHT +
    32 +
    index * TIMELINE_ROW_HEIGHT +
    index * BASE_SPACING;

  return (
    <Rect
      x={0}
      y={isBossRow ? bossRowY : rowY}
      fill={fill}
      width={width}
      height={TIMELINE_ROW_HEIGHT}
    />
  );
};

export default CanvasRow;
