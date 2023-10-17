import { MouseEvent, useEffect, useRef, useState } from "react";
import { useCounterStore } from "../lib/stores";
import styled from "styled-components";
import { useTimelineStore } from "../lib/stores/useTimelineStore";
import Canvas from "./canvas";
import { GripVertical, ListPlus } from "lucide-react";
import RowActions from "./row-actions";
import Zoom from "./zoom";

interface IProps {}

const ENCOUNTER_TIMER = 335;

const SPELL = {
  duration: 8,
  cooldown: 120,
  color: "#ffffff",
};

// TODO: play with a range input as the zoom option to scale the timeline

const Root = styled.div`
  flex: 1 0 500px;
  padding: 0 48px;
`;

const TimelineWrapper = styled.div`
  display: flex;
`;

const RowActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 48px;
`;

const CanvasWrapper = styled.div``;

const TimelineActionsWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const AddRowButton = styled.button<{ isDisabled: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #ffffff;
  cursor: pointer;
  opacity: ${({ isDisabled }) => (isDisabled ? "0.5" : "1")};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "all")};

  svg {
    flex-shrink: 0;
  }
`;

const OldTimeline: React.FC<IProps> = () => {
  const { rows, addTimelineRow } = useTimelineStore((state) => state);

  return (
    <Root>
      <TimelineActionsWrapper>
        <AddRowButton isDisabled={false} onClick={() => addTimelineRow()}>
          <ListPlus />
        </AddRowButton>
        <Zoom />
      </TimelineActionsWrapper>

      <TimelineWrapper>
        <RowActionsWrapper>
          {rows.map((_, i) => (
            <RowActions key={`row-actions-${i}`} rowIndex={i} />
          ))}
        </RowActionsWrapper>
        <CanvasWrapper>
          <Canvas width={1280} height={740} />
        </CanvasWrapper>
      </TimelineWrapper>
    </Root>
  );
};

export default OldTimeline;
