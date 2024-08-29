import React from "react";
import styled from "styled-components";
// import { useTimelineStore } from "../../lib/stores/planner/useTimelineStore";

const ZoomInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    background: white;
    height: 4px;
  }

  &::-moz-range-track {
    background: #053a5f;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: -10px;
    background-color: white;
    border: 2px solid black;
    height: 24px;
    width: 8px;
  }

  &::-moz-range-thumb {
    border-radius: 0;
    background-color: #5cd5eb;
    border: 2px solid black;
    height: 24px;
    width: 8px;
  }
`;

const Zoom = () => {
  // const { zoom, updateTimelineZoom } = useTimelineStore((state) => state);

  return (
    <ZoomInput
      type="range"
      min="4"
      max="5"
      step="0.01"
      // value={zoom}
      // onChange={(e) => updateTimelineZoom(parseFloat(e.target.value))}
    />
  );
};

export default Zoom;
