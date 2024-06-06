import React, { useEffect } from "react";
import Konva from "konva";
import { Group, Layer, Line, Rect, Stage } from "react-konva";
import { useIsKeyPressed } from "../../../lib/hooks/useIsKeyPressed";
import { useTimelineStore } from "../../../lib/stores/useTimelineStore";
import {
  BASE_SPACING,
  BOSS_TIMELINE_ROW_HEIGHT,
  GRADUATED_TIMELINE_HEIGHT,
  TIMELINE_ROW_HEIGHT,
  calculateDestinationRowIndex,
  calculateSpellDestinationRowIndex,
} from "../timeline-wrapper";
import GraduatedTimeline from "./graduated-timeline";
import CanvasRow from "./row";
import CanvasSpell from "./spell";

interface IProps {
  width: number;
  height: number;
  hoveredRow: number;
  isDraggingRow: boolean;
  ghostRowY: number;
  setHoveredRow: (index: number) => void;
}

export type Spell = {
  duration: number;
  cooldown: number;
  color: string;
  icon: string;
};

export interface Spells {
  [key: string]: Spell[];
}

export type TimelineSpell = Spell & {
  x: number;
  timing: number;
  row: number;
  isActive: boolean;
  isSelected: boolean;
};

export enum ETimelineRowType {
  BASE = "base",
  BOSS = "boss",
}

export type TimelineRow = {
  type: ETimelineRowType;
  isActive: boolean;
};

export type BossTimelineRow = TimelineRow & { type: ETimelineRowType.BOSS };

const ENCOUNTER_TIMER = 345;

const calculateSpellPositionY = (spellRow: number) =>
  BOSS_TIMELINE_ROW_HEIGHT -
  BASE_SPACING / 2 +
  (spellRow + 1) * TIMELINE_ROW_HEIGHT +
  (spellRow + 1) * BASE_SPACING;

const Canvas = ({
  width,
  height,
  hoveredRow,
  isDraggingRow,
  ghostRowY,
  setHoveredRow,
}: IProps) => {
  const {
    isDragging,
    zoom,
    spells,
    bossRow,
    rows,
    deleteTimelineSpell,
    updateTimelineSpellTiming,
    updateTimelineSpellRow,
    selectTimelineSpell,
    moveTimeline,
    toggleTimelineDrag,
  } = useTimelineStore((state) => state);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const selectedSpellIndex = spells.findIndex((spell) => spell.isSelected);
      const hasSelectedSpell = selectedSpellIndex !== -1;
      if (!hasSelectedSpell) return;
      switch (e.key) {
        case "Backspace":
          deleteTimelineSpell(selectedSpellIndex);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [spells]);

  // __________________ MOVE SPELL WITH SHIFT PRESSED
  const isShiftPressed = useIsKeyPressed("Shift");

  const handleTimeLineSpellDragStart = (spellIndex: number) => {
    // NOTE: We set temporary spell row to null so even when you drop on original row the spell snap back into place
    updateTimelineSpellRow(spellIndex, null);
  };

  const handleTimelineSpellShiftMove = (
    e: Konva.KonvaEventObject<DragEvent>,
    spellIndex: number
  ) => {
    setHoveredRow(calculateSpellDestinationRowIndex(e.target.y()));
    updateTimelineSpellTiming(spellIndex, e.target.x());
  };

  const handleTimeLineSpellDragEnd = (spellIndex: number) => {
    updateTimelineSpellRow(spellIndex, hoveredRow);
    setHoveredRow(null);
  };
  // __________________

  const index = calculateDestinationRowIndex(ghostRowY);
  const moveRowIndicatorPosY =
    BOSS_TIMELINE_ROW_HEIGHT -
    BASE_SPACING / 2 +
    index * TIMELINE_ROW_HEIGHT +
    index * BASE_SPACING;

  return (
    <Stage
      width={width}
      height={height}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      draggable
      dragBoundFunc={(pos) => {
        return {
          x: pos.x <= 0 ? pos.x : 0,
          y: 0,
        };
      }}
      onDragStart={() => {
        toggleTimelineDrag(true);
      }}
      onDragEnd={(e) => {
        moveTimeline(e.target.x());
        toggleTimelineDrag(false);
      }}
    >
      <Layer>
        {/* TODO: Might be easier to set this to 0 but would mean setting rows x to -4 so off canvas */}
        <GraduatedTimeline x={0} y={0} timer={ENCOUNTER_TIMER} zoom={zoom} />
        <Group y={GRADUATED_TIMELINE_HEIGHT}>
          <CanvasRow
            index={null}
            type={bossRow.type}
            width={ENCOUNTER_TIMER * zoom}
            isActive={bossRow.isActive}
            isHovered={false}
          />

          {rows.map(({ type, isActive }, i) => (
            <CanvasRow
              key={i}
              index={i}
              type={type}
              width={ENCOUNTER_TIMER * zoom}
              isActive={isActive}
              isHovered={i === hoveredRow}
            />
          ))}

          {isDraggingRow && (
            <>
              <Rect
                x={0}
                y={ghostRowY - TIMELINE_ROW_HEIGHT / 2}
                fill={"#2A2E34"}
                width={ENCOUNTER_TIMER * zoom}
                height={TIMELINE_ROW_HEIGHT}
              />
              <Line
                points={[
                  0,
                  moveRowIndicatorPosY,
                  ENCOUNTER_TIMER * zoom,
                  moveRowIndicatorPosY,
                ]}
                stroke="white"
              />
            </>
          )}
        </Group>
      </Layer>
      <Layer>
        {spells.map((spell, i) => (
          <CanvasSpell
            key={i}
            x={spell.x}
            y={calculateSpellPositionY(spell.row)}
            spell={spell}
            timer={ENCOUNTER_TIMER}
            onClick={() => (spell.isActive ? selectTimelineSpell(i) : null)}
            onDragStart={() => handleTimeLineSpellDragStart(i)}
            onDragMove={(e) =>
              isShiftPressed
                ? handleTimelineSpellShiftMove(e, i)
                : updateTimelineSpellTiming(i, e.target.x())
            }
            onDragEnd={() => handleTimeLineSpellDragEnd(i)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
