import React, { useState } from "react";
import { Grayscale } from "konva/lib/filters/Grayscale";
import { Group, Image as KonvaImage, Rect, Text } from "react-konva";
import { useTimelineStore } from "../../../lib/stores/useTimelineStore";
import { TimelineSpell } from ".";

interface IProps {
  x: number;
  y: number;
  spell: TimelineSpell;
  timer: number;
  isRowActive: boolean;
  onClick: () => void;
  onDragMove: (x: number) => void;
}

const CanvasSpell = ({
  x,
  y,
  spell,
  timer,
  isRowActive,
  onClick,
  onDragMove,
}: IProps) => {
  const [spellOptions, setSpellOptions] = useState({ x, isDragging: false });

  const timeline = useTimelineStore((state) => state);

  const img = new Image();
  img.src = isRowActive
    ? spell.icon
    : "https://assets.lorrgs.io/images/spells/ability_evoker_rewind.jpg";

  const isAboveMinimum = (x: number) => {
    return x >= 0 + timeline.offset;
  };

  const isUnderMaximum = (x: number) => {
    return (
      x + spell.duration * timeline.zoom <=
      timer * timeline.zoom + timeline.offset
    );
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
      draggable={isRowActive}
      dragBoundFunc={(pos) => {
        return {
          x: isAboveMinimum(pos.x)
            ? isUnderMaximum(pos.x)
              ? pos.x
              : timer * timeline.zoom -
                spell.duration * timeline.zoom +
                timeline.offset
            : 0 + timeline.offset,
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
          width={spell.cooldown * timeline.zoom + 8}
          height={40}
          strokeWidth={2}
          stroke={"white"}
        />
      )}
      <Rect
        width={spell.cooldown * timeline.zoom}
        height={32}
        fill={isRowActive ? `${spell.color}50` : `${spell.color}25`}
      />
      <Rect
        width={spell.duration * timeline.zoom}
        height={32}
        fill={isRowActive ? spell.color : `${spell.color}50`}
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
