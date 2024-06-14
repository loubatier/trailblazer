import React, { useEffect } from "react";
import Konva from "konva";
import { Group, Layer, Line, Rect, Stage } from "react-konva";
import { ETimelineRowType } from "../../../data/models/timeline";
import { useIsKeyPressed } from "../../../lib/hooks/useIsKeyPressed";
import { useBossRowStore } from "../../../lib/stores/useBossRowStore";
import { useTimelineStore } from "../../../lib/stores/useTimelineStore";
import {
  BASE_SPACING,
  BOSS_TIMELINE_ROW_HEIGHT,
  GRADUATED_TIMELINE_HEIGHT,
  TIMELINE_ROW_HEIGHT,
  calculateDestinationRowIndex,
  calculateSpellDestinationRowIndex,
} from "..";
import CanvasBossSpell from "./boss-spell";
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

export type RosterTimelineSpell = Spell & {
  x: number;
  timing: number;
  row: number;
  isActive: boolean;
  isSelected: boolean;
};

export type BossTimelineSpell = Spell & {
  x: number;
  timing: number;
  isSelected: boolean;
};

export interface BaseTimelineRow {
  type: ETimelineRowType;
}

export interface BossTimelineRow extends BaseTimelineRow {
  type: ETimelineRowType.BOSS;
  isLocked: boolean;
}

export interface RosterTimelineRow extends BaseTimelineRow {
  type: ETimelineRowType.ROSTER;
  isActive: boolean;
}

export type TimelineRow = BossTimelineRow | RosterTimelineRow;

const ENCOUNTER_TIMER = 545;

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
    rows,
    deleteTimelineSpell,
    updateTimelineSpellTiming,
    updateTimelineSpellRow,
    selectTimelineSpell,
    moveTimeline,
    toggleTimelineDrag,
  } = useTimelineStore();

  const {
    row: bossRow,
    spells: bossSpells,
    updateSpellTiming: updateBossSpellTiming,
  } = useBossRowStore();

  useEffect(() => {
    const handleKeyPress = (e) => {
      const selectedSpellIndex = spells.findIndex((spell) => spell.isSelected);
      const hasSelectedSpell = spells.some((spell) => spell.isSelected);

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

  const isStageDraggable = ENCOUNTER_TIMER * zoom > width;

  return (
    <Stage
      width={width}
      height={height}
      style={{
        cursor: isDragging ? "grabbing" : isStageDraggable ? "grab" : "default",
      }}
      draggable={isStageDraggable}
      dragBoundFunc={(pos) => {
        return {
          x:
            pos.x >= 0
              ? 0
              : width - pos.x >= ENCOUNTER_TIMER * zoom
                ? width - ENCOUNTER_TIMER * zoom
                : pos.x,
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
          <CanvasRow row={bossRow} width={ENCOUNTER_TIMER * zoom} />

          {rows.map((row, i) => (
            <CanvasRow
              key={`canvas-row-${i}`}
              row={row}
              width={ENCOUNTER_TIMER * zoom}
              isHovered={i === hoveredRow}
            />
          ))}

          {isDraggingRow && (
            <>
              <Rect
                x={0}
                y={ghostRowY - TIMELINE_ROW_HEIGHT / 2}
                fill={"#2A2E3450"}
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
        {bossSpells.map((spell, i) => (
          <CanvasBossSpell
            key={i}
            x={spell.x}
            y={40 + 32 + 4}
            spell={spell}
            timer={ENCOUNTER_TIMER}
            onClick={() => console.error("Click boss spell")}
            onDragMove={(e) => updateBossSpellTiming(i, e.target.x(), zoom)}
          />
        ))}

        {spells.map((spell, i) => (
          <CanvasSpell
            key={i}
            x={spell.x}
            y={calculateSpellPositionY(spell.row)}
            spell={spell}
            timer={ENCOUNTER_TIMER}
            onClick={() => selectTimelineSpell(i)}
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
