import React, { useState } from "react";
import Konva from "konva";
import { Group, Image as KonvaImage, Rect, Text } from "react-konva";
import { useBossRowStore } from "../../../lib/stores/useBossRowStore";
import { useTimelineStore } from "../../../lib/stores/useTimelineStore";
import { BASE_SPACING, TIMELINE_ROW_HEIGHT } from "../timeline-wrapper";
import { BossTimelineSpell } from ".";

interface IProps {
  x: number;
  y: number;
  spell: BossTimelineSpell;
  timer: number;
  onClick: () => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

const CanvasBossSpell = ({
  x,
  y,
  spell,
  timer,
  onClick,
  onDragMove,
}: IProps) => {
  const [spellOptions, setSpellOptions] = useState({ x, isDragging: false });
  const { zoom, offset } = useTimelineStore((state) => state);
  const { row } = useBossRowStore();

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
      draggable={!row.isLocked}
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
      }}
      onClick={onClick}
    >
      {spell.isSelected && (
        <Rect
          x={-4}
          y={-4}
          width={spell.cooldown * zoom + BASE_SPACING}
          height={TIMELINE_ROW_HEIGHT}
          strokeWidth={2}
          stroke={"white"}
        />
      )}
      <Rect
        width={spell.cooldown * zoom}
        height={32}
        fill={`${spell.color}50`}
      />
      <Rect width={spell.duration * zoom} height={32} fill={spell.color} />
      <KonvaImage image={img} width={24} height={24} y={4} x={4} />
      <Text text={getSpellTiming(spell.timing)} y={10} x={32} fill="white" />
    </Group>
  );
};

export default CanvasBossSpell;
