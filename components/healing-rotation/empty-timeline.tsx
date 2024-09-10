import React from "react";
import styled from "styled-components";
import { Button } from "../sharedstyles";
// import { useTimelineStore } from "../../lib/stores/planner/useTimelineStore";

interface IProps {
  onClick: () => void;
}

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

const EmptyTimeline = ({ onClick }: IProps) => {
  return (
    <Root>
      <p>No timeline existing for given roster boss difficulty combo</p>
      <Button onClick={onClick}>Create a new one</Button>
    </Root>
  );
};

export default EmptyTimeline;
