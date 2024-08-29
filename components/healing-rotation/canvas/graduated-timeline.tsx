import React from "react";
import { Group, Line, Rect } from "react-konva";
import { useTimelineStore } from "../../../lib/stores/planner/useTimelineStore";

interface IProps {
  x: number;
  y: number;
  timer: number;
  zoom: number;
}

const LINE_HEIGHT = 40;

const GraduatedTimeline = ({ x, y }: IProps) => {
  const { timeline, zoom } = useTimelineStore();

  const lines = [];
  for (let seconds = 0; seconds <= timeline.timer; seconds += 10) {
    const isThirdLine = seconds % 30 === 0;
    const xPos = seconds === 0 ? seconds * zoom + 0.5 : seconds * zoom;

    lines.push(
      <Line
        key={`line-${seconds}`}
        x={xPos}
        y={LINE_HEIGHT}
        points={[0, 0, 0, isThirdLine ? -40 : -20]}
        closed
        stroke="white"
        strokeWidth={0.5}
      />
    );
  }

  return (
    <Group x={x} y={y}>
      <Rect
        width={timeline.timer * zoom}
        height={LINE_HEIGHT}
        fill={"#23262B"}
      />
      <Line
        points={[0, LINE_HEIGHT, timeline.timer * zoom, LINE_HEIGHT]}
        closed
        stroke="white"
        strokeWidth={0.5}
      />
      {lines}
    </Group>
  );
};

export default GraduatedTimeline;
