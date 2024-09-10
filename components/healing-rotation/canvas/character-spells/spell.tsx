import React, { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Group, Image as KonvaImage, Rect, Text } from "react-konva";
import {
  BASE_SPACING,
  BOSS_TIMELINE_ROW_HEIGHT,
  GRADUATED_TIMELINE_HEIGHT,
  TIMELINE_ROW_HEIGHT,
} from "../..";
import { useIsKeyPressed } from "../../../../lib/hooks/useIsKeyPressed";
import { useTimelineCharacterSpellStore } from "../../../../lib/stores/planner/useTimelineCharacterSpellsStore";
import { useTimelineRosterRowStore } from "../../../../lib/stores/planner/useTimelineRosterRowsStore";
import { useTimelineStore } from "../../../../lib/stores/planner/useTimelineStore";
import { TimelineCharacterSpell } from "../../../../lib/types/planner/timeline";
import KonvaTooltip from "../tooltip";

interface IProps {
  spell: TimelineCharacterSpell;
  onClick: () => void;
  onDragStart: () => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

const calculateSpellPositionY = (spellRow: number) =>
  BOSS_TIMELINE_ROW_HEIGHT -
  BASE_SPACING / 2 +
  (spellRow + 1) * TIMELINE_ROW_HEIGHT +
  (spellRow + 1) * BASE_SPACING;

const isSpellUseConflictual = (
  spell: TimelineCharacterSpell,
  otherSpells: TimelineCharacterSpell[]
) =>
  otherSpells.some((otherSpell) => {
    if (
      otherSpell.character?.id === spell.character?.id &&
      otherSpell.spellId === spell.spellId &&
      otherSpell.id !== spell.id
    ) {
      const timeDifference = Math.abs(otherSpell.timing - spell.timing);
      return timeDifference <= (spell.cooldown ?? 0);
    }
    return false;
  });

const CanvasSpell = ({
  spell,
  onClick,
  onDragStart,
  onDragMove,
  onDragEnd,
}: IProps) => {
  const isShiftPressed = useIsKeyPressed("Shift");
  const [isSpellHovered, setIsSpellHovered] = useState(false);

  const { timeline, zoom, offset, isDragging, toggleIsDragging } =
    useTimelineStore((state) => state);
  const { timelineRosterRows } = useTimelineRosterRowStore();
  const { timelineCharacterSpells } = useTimelineCharacterSpellStore();
  const [isSpellConflictual, setIsSpellConflictual] = useState(
    isSpellUseConflictual(spell, timelineCharacterSpells)
  );
  useEffect(() => {
    setIsSpellConflictual(
      isSpellUseConflictual(spell, timelineCharacterSpells)
    );
  }, [spell, timelineCharacterSpells]);

  const row = timelineRosterRows.find((trr) => trr.id === spell.rowId);
  const y = calculateSpellPositionY(row?.position ?? -1000);
  const isActive = row?.isActive ?? true;

  const img = new Image();
  img.src = spell.icon;
  img.crossOrigin = "anonymous";

  const isAboveXMinimum = (x: number) => {
    return x >= 0 + offset;
  };

  const isUnderXMaximum = (x: number) => {
    return x + spell.duration * zoom <= timeline.timer * zoom + offset;
  };

  const isAboveYMinimum = (y: number) => {
    return y >= GRADUATED_TIMELINE_HEIGHT + BOSS_TIMELINE_ROW_HEIGHT - 16;
  };

  const isUnderYMaximum = (y: number) => {
    return (
      y <=
      BOSS_TIMELINE_ROW_HEIGHT +
        timelineRosterRows.length * BASE_SPACING +
        timelineRosterRows.length * TIMELINE_ROW_HEIGHT +
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
          : timeline.timer * zoom - spell.duration * zoom + offset
        : 0 + offset,
      y,
    };
  };

  const keyPressedDragBoundFunc = (pos) => {
    return {
      x: isAboveXMinimum(pos.x)
        ? isUnderXMaximum(pos.x)
          ? pos.x
          : timeline.timer * zoom - spell.duration * zoom + offset
        : 0 + offset,
      y: isAboveYMinimum(pos.y)
        ? isUnderYMaximum(pos.y)
          ? pos.y
          : BOSS_TIMELINE_ROW_HEIGHT +
            timelineRosterRows.length * BASE_SPACING +
            timelineRosterRows.length * TIMELINE_ROW_HEIGHT +
            16
        : 0 + GRADUATED_TIMELINE_HEIGHT + BOSS_TIMELINE_ROW_HEIGHT - 16,
    };
  };

  const filterRef = useRef(null);

  useEffect(() => {
    filterRef.current.cache();
    filterRef.current.red(255);
    filterRef.current.green(0);
    filterRef.current.blue(60);
  }, [spell, isActive, isSpellConflictual]);

  const filters = isActive
    ? isSpellConflictual
      ? [Konva.Filters.RGB]
      : []
    : [Konva.Filters.Grayscale];

  return (
    <Group
      x={spell.timing * zoom}
      y={y}
      style={{ cursor: isDragging ? "help" : "grab" }}
      draggable={isActive}
      dragBoundFunc={(pos) => {
        return isShiftPressed
          ? keyPressedDragBoundFunc(pos)
          : baseDragBoundFunc(pos);
      }}
      onDragStart={(e) => {
        e.cancelBubble = true;
        toggleIsDragging();
        isShiftPressed && onDragStart();
      }}
      onDragMove={(e) => {
        e.cancelBubble = true;
        onDragMove(e);
      }}
      onDragEnd={(e) => {
        e.cancelBubble = true;
        toggleIsDragging();
        onDragEnd(e);
      }}
      onClick={onClick}
      onMouseEnter={() => setIsSpellHovered(true)}
      onMouseLeave={() => setIsSpellHovered(false)}
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

      <Group ref={filterRef} filters={filters}>
        <Rect
          width={spell.cooldown * zoom}
          height={32}
          fill={spell.color}
          opacity={isActive ? 0.5 : 0.25}
        />
        <Rect
          width={spell.duration === 0 ? 4 : spell.duration * zoom}
          height={32}
          fill={spell.color}
          opacity={isActive ? 1 : 0.5}
        />
        <KonvaImage image={img} width={24} height={24} y={4} x={4} />
      </Group>
      <Text
        text={`${getSpellTiming(spell.timing)} ${spell.character ? spell.character.name : "Everyone"}`}
        y={10}
        x={32}
        fill={"white"}
      />

      <KonvaTooltip
        text={"You're using a spell before its cooldown is over."}
        x={spell.timing * zoom}
        y={y + 1}
        elementWidth={spell.cooldown * zoom}
        isVisible={isSpellHovered && isSpellConflictual && !isDragging}
        type={"error"}
      />
    </Group>
  );
};

export default CanvasSpell;
