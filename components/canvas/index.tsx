// src/components/DraggableCanvas.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Circle,
  Group,
  Image as _Image,
  Layer,
  Rect,
  Stage,
  Text,
  Line,
} from "react-konva";
import CanvasSpell from "./spell";
import Timeline from "./timeline";
import { useStore } from "zustand";
import {
  EMoveDirection,
  useTimelineStore,
} from "../../lib/stores/useTimelineStore";

interface IProps {
  width: number;
  height: number;
  hoveredRow: number;
  isDraggingRow: boolean;
  destinationRowIndex: number;
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
const NEW_SPELL = {
  duration: 12,
  cooldown: 180,
  color: "#00ff98",
  icon: "https://assets.lorrgs.io/images/spells/spell_monk_revival.jpg",
};

const Canvas: React.FC<IProps> = ({
  width,
  height,
  hoveredRow,
  isDraggingRow,
  destinationRowIndex,
  ghostRowY,
}) => {
  const {
    zoom,
    spells,
    rows,
    deleteTimelineSpell,
    updateTimelineSpellTiming,
    updateTimelineSpellRow,
    selectTimelineSpell,
  } = useTimelineStore((state) => state);

  const [timelineOptions, setTimelineOptions] = useState({
    x: 0,
    isDragging: false,
  });

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

  const index = Math.floor((ghostRowY - 40) / 40);
  const moveRowIndicatorPosY = 40 + 4 + index * 40 + index * 8;

  return (
    <Stage
      width={width}
      height={height}
      style={{ cursor: timelineOptions.isDragging ? "grabbing" : "grab" }}
      draggable
      dragBoundFunc={(pos) => {
        return {
          x: pos.x <= 0 ? pos.x : 0,
          y: 0,
        };
      }}
      onDragStart={() => {
        setTimelineOptions({
          ...timelineOptions,
          isDragging: true,
        });
      }}
      onDragEnd={(e) => {
        setTimelineOptions({
          isDragging: false,
          x: e.target.x(),
        });
      }}
    >
      <Layer>
        {/* TODO: Might be easier to set this to 0 but would mean setting rows x to -4 so off canvas */}
        <Group>
          <Timeline x={0} y={0} timer={ENCOUNTER_TIMER} zoom={zoom} />
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
        {spells.map((timelineSpell, i) => (
          <CanvasSpell
            key={i}
            x={timelineSpell.x}
            y={4 + (timelineSpell.row + 1) * 40 + (timelineSpell.row + 1) * 8}
            spell={timelineSpell}
            timer={ENCOUNTER_TIMER}
            timelineOptions={timelineOptions}
            zoom={zoom}
            isSelected={true}
            isActive={
              timelineSpell.row >= 0 && timelineSpell.row < rows.length
                ? rows[timelineSpell.row].isActive
                : false
            }
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
