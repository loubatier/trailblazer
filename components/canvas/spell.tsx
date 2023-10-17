import React, { useEffect, useRef, useState } from "react";
import { Group, Image as KonvaImage, Rect, Text } from "react-konva";
import Konva from "konva";
import { TimelineSpell } from ".";
import { Grayscale } from "konva/lib/filters/Grayscale";
import { Contrast } from "konva/lib/filters/Contrast";

interface IProps {
  x: number;
  y: number;
  spell: TimelineSpell;
  timer: number;
  timelineOptions: any;
  zoom: number;
  isSelected: boolean;
  isActive: boolean;
  onClick: () => void;
  onDragMove: (x: number) => void;
}

const CanvasSpell: React.FC<IProps> = ({
  x,
  y,
  spell,
  timer,
  timelineOptions,
  zoom,
  isSelected,
  isActive,
  onClick,
  onDragMove,
}) => {
  const [spellOptions, setSpellOptions] = useState({ x: x, isDragging: false });
  const img = new Image();
  img.src = isActive
    ? spell.icon
    : "https://assets.lorrgs.io/images/spells/ability_evoker_rewind.jpg";

  const isAboveMinimum = (x: number) => {
    return x >= 0 + timelineOptions.x;
  };

  const isUnderMaximum = (x: number) => {
    return x + spell.duration * zoom <= timer * zoom + timelineOptions.x;
  };

  const getSpellTiming = (timing) => {
    const minutes = Math.floor(timing / 60);
    const secondsRemaining = Math.floor(timing % 60);
    return `${String(minutes).padStart(2, "0")}:${String(
      secondsRemaining
    ).padStart(2, "0")}`;
  };

  return (
    <Group
      x={x}
      y={y}
      style={{ cursor: spellOptions.isDragging ? "grabbing" : "grab" }}
      draggable={isActive}
      dragBoundFunc={(pos) => {
        return {
          x: isAboveMinimum(pos.x)
            ? isUnderMaximum(pos.x)
              ? pos.x
              : timer * zoom - spell.duration * zoom + timelineOptions.x
            : 0 + timelineOptions.x,
          y: y,
        };
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
        onDragMove(e.target.x());
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
          width={spell.cooldown * zoom + 8}
          height={40}
          strokeWidth={2}
          stroke={"white"}
        />
      )}
      <Rect
        width={spell.cooldown * zoom}
        height={32}
        fill={isActive ? `${spell.color}50` : `${spell.color}25`}
      />
      <Rect
        width={spell.duration * zoom}
        height={32}
        fill={isActive ? spell.color : `${spell.color}50`}
      />
      <KonvaImage
        image={img}
        width={24}
        height={24}
        y={4}
        x={4}
        filters={[Grayscale]}
      />
      <Text text={getSpellTiming(spell.timing)} y={10} x={36} fill="white" />
    </Group>
  );
};

export default CanvasSpell;
