import React from "react";
import { Group, Layer, Line, Rect, Stage } from "react-konva";
import { useTimelineStore } from "../../../lib/stores/planner/useTimelineStore";
import {
  BASE_SPACING,
  BOSS_TIMELINE_ROW_HEIGHT,
  GRADUATED_TIMELINE_HEIGHT,
  TIMELINE_ROW_HEIGHT,
  calculateDestinationRowIndex,
} from "..";
import CanvasBossRow from "./boss-row";
import CanvasBossSpells from "./boss-spells";
import CanvasCharacterSpells from "./character-spells";
import GraduatedTimeline from "./graduated-timeline";
import CanvasRosterRows from "./roster-rows";

interface IProps {
  width: number;
  height: number;
  isDraggingRow: boolean;
  ghostRowY: number;
  hoveredRow: number;
  setHoveredRow: (index: number) => void;
}

const TimelineCanvas = ({
  width,
  height,
  isDraggingRow,
  ghostRowY,
  hoveredRow,
  setHoveredRow,
}: IProps) => {
  const { timeline, zoom, moveTimeline, isDragging, toggleIsDragging } =
    useTimelineStore();

  const destinationRowIndex = calculateDestinationRowIndex(ghostRowY);
  const destinationRowIndicatorY =
    BOSS_TIMELINE_ROW_HEIGHT -
    BASE_SPACING / 2 +
    destinationRowIndex * TIMELINE_ROW_HEIGHT +
    destinationRowIndex * BASE_SPACING;

  const isStageDraggable = timeline.timer * zoom > width;

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
              : width - pos.x >= timeline.timer * zoom
                ? width - timeline.timer * zoom
                : pos.x,
          y: 0,
        };
      }}
      onDragStart={() => {
        toggleIsDragging();
      }}
      onDragEnd={(e) => {
        moveTimeline(e.target.x());
        toggleIsDragging();
      }}
    >
      <Layer>
        <GraduatedTimeline x={0} y={0} timer={timeline.timer} zoom={zoom} />
        <Group y={GRADUATED_TIMELINE_HEIGHT}>
          <CanvasBossRow width={timeline.timer * zoom} />
          <CanvasRosterRows hoveredRow={hoveredRow} />

          {isDraggingRow && destinationRowIndex >= 0 && (
            <>
              <Rect
                x={0}
                y={ghostRowY - TIMELINE_ROW_HEIGHT / 2}
                fill={"#2A2E3450"}
                width={timeline.timer * zoom}
                height={TIMELINE_ROW_HEIGHT}
              />

              <Line
                points={[
                  0,
                  destinationRowIndicatorY,
                  timeline.timer * zoom,
                  destinationRowIndicatorY,
                ]}
                stroke="white"
              />
            </>
          )}
        </Group>
      </Layer>
      <Layer>
        <CanvasBossSpells />
        <CanvasCharacterSpells
          hoveredRow={hoveredRow}
          setHoveredRow={setHoveredRow}
        />
      </Layer>
      <Layer name="top-layer" />
    </Stage>
  );
};

export default TimelineCanvas;
