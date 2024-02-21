import React, { useEffect } from "react";
import { Group, Layer, Line, Rect, Stage } from "react-konva";
import {
  EMoveDirection,
  useTimelineStore,
} from "../../../lib/stores/useTimelineStore";
import CanvasSpell from "./spell";
import Timeline from "./timeline";

interface IProps {
  width: number;
  height: number;
  hoveredRow: number;
  isDraggingRow: boolean;
  ghostRowY: number;
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
  isSelected: boolean;
};

export type TimelineRow = {
  isActive: boolean;
};

const ENCOUNTER_TIMER = 345;

const Canvas = ({
  width,
  height,
  hoveredRow,
  isDraggingRow,
  ghostRowY,
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
    move,
    drag,
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
        case "ArrowUp":
          e.preventDefault();
          spells[selectedSpellIndex].row > 0
            ? updateTimelineSpellRow(selectedSpellIndex, EMoveDirection.UP)
            : null;
          break;
        case "ArrowDown":
          e.preventDefault();
          spells[selectedSpellIndex].row < rows.length - 1
            ? updateTimelineSpellRow(selectedSpellIndex, EMoveDirection.DOWN)
            : null;
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

  // const index = Math.floor((ghostRowY - 40) / 40);
  // const moveRowIndicatorPosY = 40 + 4 + index * 40 + index * 8;

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
        drag(true);
      }}
      onDragEnd={(e) => {
        move(e.target.x());
        drag(false);
      }}
    >
      <Layer>
        {/* TODO: Might be easier to set this to 0 but would mean setting rows x to -4 so off canvas */}
        <Group>
          {rows.map(({ isActive }, i) => (
            <Rect
              key={i}
              x={0}
              y={40 + 8 + i * 40 + i * 8}
              fill={
                isActive
                  ? i === hoveredRow
                    ? "#2A2E34"
                    : "#23262B"
                  : "#23262B50"
              }
              width={ENCOUNTER_TIMER * zoom}
              height={40}
            />
          ))}
          {isDraggingRow && (
            <>
              <Rect
                x={0}
                y={ghostRowY - 20}
                fill={"#2A2E34"}
                width={ENCOUNTER_TIMER * zoom}
                height={40}
              />
              <Line
                points={[0, ghostRowY, ENCOUNTER_TIMER * zoom, ghostRowY]}
                stroke="white"
              />
            </>
          )}
          <Timeline x={0} y={0} timer={ENCOUNTER_TIMER} zoom={zoom} />
        </Group>
      </Layer>
      <Layer>
        {spells.map((timelineSpell, i) => (
          <CanvasSpell
            key={i}
            x={timelineSpell.x}
            y={4 + (timelineSpell.row + 1) * 40 + (timelineSpell.row + 1) * 8}
            spell={timelineSpell}
            timer={ENCOUNTER_TIMER}
            isRowActive={rows[timelineSpell.row].isActive}
            onClick={() =>
              rows[timelineSpell.row].isActive ? selectTimelineSpell(i) : null
            }
            onDragMove={(x) => updateTimelineSpellTiming(i, x)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
