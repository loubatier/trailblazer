import React from "react";
import { Rect } from "react-konva";
import { TIMELINE_ROW_HEIGHT } from "..";
import { useTimelineBossSpellsStore } from "../../../lib/stores/planner/useTimelineBossSpellsStore";

interface IProps {
  width: number;
}

const CanvasBossRow = ({ width }: IProps) => {
  const { isLocked } = useTimelineBossSpellsStore();
  const fill = isLocked ? "#15171850" : "#151718";
  const y = 32;

  return (
    <Rect x={0} y={y} fill={fill} width={width} height={TIMELINE_ROW_HEIGHT} />
  );
};

export default CanvasBossRow;
