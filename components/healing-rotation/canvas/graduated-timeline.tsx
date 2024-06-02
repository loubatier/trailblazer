import React from "react";
import { Group, Line, Rect } from "react-konva";

interface IProps {
  x: number;
  y: number;
  timer: number;
  zoom: number;
}

const LINE_HEIGHT = 40;

const GraduatedTimeline = ({ x, y, timer, zoom }: IProps) => {
  const lines = [];

  for (let seconds = 0; seconds <= timer * zoom; seconds += 10 * zoom) {
    const xPos = seconds;
    const isThirdLine = seconds % (30 * zoom) === 0;
    lines.push(
      <Line
        key={xPos}
        x={xPos}
        y={LINE_HEIGHT}
        points={[0, 0, 0, isThirdLine ? -20 * 2 : -20]}
        closed
        stroke="white"
        strokeWidth={0.5}
      />
    );
  }

  return (
    <Group x={x} y={y}>
      <Rect width={timer * zoom} height={LINE_HEIGHT} fill={"#1c1e20"} />
      <Line
        points={[0, LINE_HEIGHT, timer * zoom, LINE_HEIGHT]}
        closed
        stroke="white"
        strokeWidth={0.5}
      />
      {lines}
    </Group>
  );
};

export default GraduatedTimeline;
