import React from "react";
import { Group, Line, Rect } from "react-konva";

interface IProps {
  x: number;
  y: number;
  timer: number;
  zoom: number;
}

const Timeline: React.FC<IProps> = ({ x, y, timer, zoom }) => {
  const lines = [];
  for (let seconds = 0; seconds <= timer * zoom; seconds += 10 * zoom) {
    const xPos = seconds;
    const isThirdLine = seconds % (30 * zoom) === 0;
    lines.push(
      <Line
        key={xPos}
        x={xPos}
        y={40}
        points={[0, 0, 0, isThirdLine ? -20 * 2 : -20]}
        closed
        stroke="white"
        strokeWidth={0.5}
      />
    );
  }

  return (
    <Group x={x} y={y}>
      <Rect width={timer * zoom} height={40} fill={"#1c1e20"} />
      <Line
        points={[0, 40, timer * zoom, 40]}
        closed
        stroke="white"
        strokeWidth={0.5}
      />
      {lines}
    </Group>
  );
};

export default Timeline;
