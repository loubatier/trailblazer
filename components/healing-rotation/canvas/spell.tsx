import React, { useState } from "react";
import Konva from "konva";
import { Group, Image as KonvaImage, Rect, Text } from "react-konva";
import { useIsKeyPressed } from "../../../lib/hooks/useIsKeyPressed";
import { useTimelineStore } from "../../../lib/stores/useTimelineStore";
import { TimelineSpell } from ".";

interface IProps {
  x: number;
  y: number;
  spell: TimelineSpell;
  timer: number;
  isRowActive: boolean;
  onClick: () => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: () => void;
}

const CanvasSpell = ({
  x,
  y,
  spell,
  timer,
  isRowActive,
  onClick,
  onDragMove,
  onDragEnd,
}: IProps) => {
  const [spellOptions, setSpellOptions] = useState({ x, isDragging: false });

  const isShiftPressed = useIsKeyPressed("Shift");

  const hasShadow = false;

  const { zoom, offset } = useTimelineStore((state) => state);

  const img = new Image();
  img.src = isRowActive
    ? spell.icon
    : "https://assets.lorrgs.io/images/spells/ability_evoker_rewind.jpg";

  const isAboveMinimum = (x: number) => {
    return x >= 0 + offset;
  };

  const isUnderMaximum = (x: number) => {
    return x + spell.duration * zoom <= timer * zoom + offset;
  };

  const shadowProps = {
    shadowColor: "black",
    shadowBlur: 10,
    shadowOffsetX: 10,
    shadowOffsetY: 10,
    shadowOpacity: 0.5,
  };

  const getSpellTiming = (timing) => {
    const minutes = Math.floor(timing / 60);
    const secondsRemaining = Math.floor(timing % 60);
    return `${String(minutes).padStart(2, "0")}:${String(
      secondsRemaining
    ).padStart(2, "0")}`;
  };

  const baseDragBoundFunc = (pos) => {
    return {
      x: isAboveMinimum(pos.x)
        ? isUnderMaximum(pos.x)
          ? pos.x
          : timer * zoom - spell.duration * zoom + offset
        : 0 + offset,
      y: y,
    };
  };

  const keyPressedDragBoundFunc = (pos) => {
    return {
      x: isAboveMinimum(pos.x)
        ? isUnderMaximum(pos.x)
          ? pos.x
          : timer * zoom - spell.duration * zoom + offset
        : 0 + offset,
      y: pos.y,
    };
  };

  return (
    <Group
      x={x}
      y={y}
      style={{ cursor: spellOptions.isDragging ? "grabbing" : "grab" }}
      draggable={isRowActive}
      dragBoundFunc={(pos) => {
        return isShiftPressed
          ? keyPressedDragBoundFunc(pos)
          : baseDragBoundFunc(pos);
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
        isShiftPressed && onDragEnd();
      }}
      onClick={onClick}
    >
      {spell.isSelected && (
        <Rect
          x={-4}
          y={-4}
          width={spell.cooldown * zoom + 8}
          height={40}
          strokeWidth={2}
          stroke={"white"}
        />
      )}
      <Rect
        width={spell.cooldown * zoom}
        height={32}
        fill={isRowActive ? `${spell.color}50` : `${spell.color}25`}
        {...(hasShadow ? shadowProps : {})}
      />
      <Rect
        width={spell.duration * zoom}
        height={32}
        fill={isRowActive ? spell.color : `${spell.color}50`}
      />
      <KonvaImage image={img} width={24} height={24} y={4} x={4} />
      <Text text={getSpellTiming(spell.timing)} y={10} x={36} fill="white" />
    </Group>
  );
};

export default CanvasSpell;
