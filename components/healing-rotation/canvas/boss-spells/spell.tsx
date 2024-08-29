import React, { useState } from "react";
import Konva from "konva";
import { Group, Image as KonvaImage, Rect, Text } from "react-konva";
import { BASE_SPACING, TIMELINE_ROW_HEIGHT } from "../..";
import { useTimelineStore } from "../../../../lib/stores/planner/useTimelineStore";
import { TimelineBossSpell } from "../../../../lib/types/planner/timeline";

interface IProps {
  spell: TimelineBossSpell;
  isLocked: boolean;
  timer: number;
  x: number;
  onClick: () => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

const CanvasBossSpell = ({
  spell,
  isLocked,
  timer,
  x,
  onClick,
  onDragMove,
  onDragEnd,
}: IProps) => {
  const [spellOptions, setSpellOptions] = useState({ x, isDragging: false });
  const { zoom, offset } = useTimelineStore();
  const y = TIMELINE_ROW_HEIGHT + BASE_SPACING * 4 + BASE_SPACING / 2;

  const img = new Image();
  img.src = spell.icon;

  const isAboveXMinimum = (x: number) => {
    return x >= 0 + offset;
  };

  const isUnderXMaximum = (x: number) => {
    return x + spell.duration * zoom <= timer * zoom + offset;
  };

  const getSpellTiming = (timing: number) => {
    const minutes = Math.floor(timing / 60);
    const secondsRemaining = Math.floor(timing % 60);
    return `${String(minutes).padStart(2, "0")}:${String(
      secondsRemaining
    ).padStart(2, "0")}`;
  };

  const baseDragBoundFunc = (pos) => {
    return {
      x: isAboveXMinimum(pos.x)
        ? isUnderXMaximum(pos.x)
          ? pos.x
          : timer * zoom - spell.duration * zoom + offset
        : 0 + offset,
      y: y,
    };
  };

  return (
    <Group
      x={x}
      y={y}
      style={{ cursor: spellOptions.isDragging ? "grabbing" : "grab" }}
      draggable={!isLocked}
      dragBoundFunc={(pos) => {
        return baseDragBoundFunc(pos);
      }}
      onDragStart={(e) => {
        e.cancelBubble = true;
        setSpellOptions({
          ...spellOptions,
          isDragging: true,
        });
      }}
      onDragMove={(e) => {
        e.cancelBubble = true;
        setSpellOptions({
          ...spellOptions,
          x: e.target.x(),
        });
        onDragMove(e);
      }}
      onDragEnd={(e) => {
        e.cancelBubble = true;
        setSpellOptions({
          ...spellOptions,
          isDragging: false,
        });
        onDragEnd(e);
      }}
      onClick={onClick}
    >
      <Rect width={spell.duration * zoom} height={32} fill={spell.color} />
      <KonvaImage image={img} width={24} height={24} y={4} x={4} />
      <Text text={getSpellTiming(spell.timing)} y={10} x={32} fill={"white"} />
    </Group>
  );
};

export default CanvasBossSpell;
