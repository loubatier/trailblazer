import React from "react";
import { Rect } from "react-konva";
import { useTimelineStore } from "../../../lib/stores/useTimelineStore";
import {
  BASE_SPACING,
  BOSS_TIMELINE_ROW_HEIGHT,
  TIMELINE_ROW_HEIGHT,
} from "../timeline-wrapper";
import { BossTimelineRow, ETimelineRowType, TimelineRow } from ".";

interface IProps {
  row: TimelineRow | BossTimelineRow;
  width: number;
  isHovered?: boolean;
}

const CanvasRow = ({ width, row, isHovered = false }: IProps) => {
  const { rows } = useTimelineStore((state) => state);

  const isBossRow = row.type === ETimelineRowType.BOSS;
  const isActive = isBossRow || row.isActive;
  const index = isBossRow ? null : rows.indexOf(row);

  const fill = isActive ? (isHovered ? "#2A2E34" : "#23262B") : "#23262B50";
  const y = isBossRow
    ? 32
    : BOSS_TIMELINE_ROW_HEIGHT + index * (TIMELINE_ROW_HEIGHT + BASE_SPACING);

  return (
    <Rect x={0} y={y} fill={fill} width={width} height={TIMELINE_ROW_HEIGHT} />
  );
};

export default CanvasRow;
