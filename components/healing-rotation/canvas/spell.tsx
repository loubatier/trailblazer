import React, { useState } from "react";
import Konva from "konva";
import { isNil } from "lodash";
import { Group, Image as KonvaImage, Rect, Text } from "react-konva";
import { useIsKeyPressed } from "../../../lib/hooks/useIsKeyPressed";
import { useTimelineStore } from "../../../lib/stores/useTimelineStore";
import {
  BASE_SPACING,
  BOSS_TIMELINE_ROW_HEIGHT,
  GRADUATED_TIMELINE_HEIGHT,
  TIMELINE_ROW_HEIGHT,
} from "..";
import { RosterTimelineSpell } from ".";

interface IProps {
  x: number;
  y: number;
  spell: RosterTimelineSpell;
  timer: number;
  onClick: () => void;
  onDragStart: () => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: () => void;
}

const CanvasSpell = ({
  x,
  y,
  spell,
  timer,
  onClick,
  onDragStart,
  onDragMove,
  onDragEnd,
}: IProps) => {
  const [spellOptions, setSpellOptions] = useState({ x, isDragging: false });
  const isShiftPressed = useIsKeyPressed("Shift");
  const { zoom, offset, rows } = useTimelineStore((state) => state);

  const img = new Image();
  img.src = spell.isActive
    ? spell.icon
    : "https://assets.lorrgs.io/images/spells/ability_evoker_rewind.jpg";

  const isAboveXMinimum = (x: number) => {
    return x >= 0 + offset;
  };

  const isUnderXMaximum = (x: number) => {
    return x + spell.duration * zoom <= timer * zoom + offset;
  };

  const isAboveYMinimum = (y: number) => {
    return y >= GRADUATED_TIMELINE_HEIGHT + BOSS_TIMELINE_ROW_HEIGHT - 16;
  };

  const isUnderYMaximum = (y: number) => {
    return (
      y <=
      BOSS_TIMELINE_ROW_HEIGHT +
        rows.length * BASE_SPACING +
        rows.length * TIMELINE_ROW_HEIGHT -
        BASE_SPACING / 2 +
        16
    );
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

  const keyPressedDragBoundFunc = (pos) => {
    return {
      x: isAboveXMinimum(pos.x)
        ? isUnderXMaximum(pos.x)
          ? pos.x
          : timer * zoom - spell.duration * zoom + offset
        : 0 + offset,
      y: isAboveYMinimum(pos.y)
        ? isUnderYMaximum(pos.y)
          ? pos.y
          : BOSS_TIMELINE_ROW_HEIGHT +
            rows.length * BASE_SPACING +
            rows.length * TIMELINE_ROW_HEIGHT -
            BASE_SPACING / 2 +
            16
        : 0 + GRADUATED_TIMELINE_HEIGHT + BOSS_TIMELINE_ROW_HEIGHT - 16,
    };
  };

  return (
    <Group
      x={x}
      y={!isNil(spell.row) ? y : -10000} // NOTE: We offset the spell out of the view to avoid displaying a flicker
      style={{ cursor: spellOptions.isDragging ? "grabbing" : "grab" }}
      draggable={spell.isActive}
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
        isShiftPressed && onDragStart();
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
          width={spell.cooldown * zoom + BASE_SPACING}
          height={TIMELINE_ROW_HEIGHT}
          strokeWidth={2}
          stroke={"white"}
        />
      )}
      <Rect
        width={spell.cooldown * zoom}
        height={32}
        fill={spell.isActive ? `${spell.color}50` : `${spell.color}25`}
      />
      <Rect
        width={spell.duration * zoom}
        height={32}
        fill={spell.isActive ? spell.color : `${spell.color}50`}
      />
      <KonvaImage image={img} width={24} height={24} y={4} x={4} />
      <Text text={getSpellTiming(spell.timing)} y={10} x={32} fill="white" />
    </Group>
  );
};

export default CanvasSpell;
