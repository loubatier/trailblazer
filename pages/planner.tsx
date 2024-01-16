import Link from "next/link";
import {
  Container,
  Main,
  Title,
  Description,
} from "../components/sharedstyles";
// import Timeline from "../components/timeline";
import styled from "styled-components";
import dynamic from "next/dynamic";
import {
  ChevronDownSquare,
  ChevronUpSquare,
  Delete,
  Grab,
  GripVertical,
  MousePointerClick,
  MoveHorizontal,
} from "lucide-react";

const OldTimeline = dynamic(
  () => import("../components/healing-rotation/old-timeline"),
  {
    ssr: false,
  }
);

const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const InfosContainer = styled.div`
  display: flex;
  padding: 48px;
  gap: 96px;
`;
const InfosWrapper = styled.div``;

const Info = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoTitle = styled.p`
  font-size: 24px;
  font-weight: 100;
  padding-left: 16px;
  border-left: 3px solid white;
`;

const Planner: React.FC = () => {
  return (
    <Container>
      <Main>
        <Title>Timeline Page</Title>
        <Description>
          <Link href="/">&larr; Go Back</Link>
        </Description>
        <InfosContainer>
          <InfosWrapper>
            <InfoTitle>Spell informations</InfoTitle>
            <Info>
              <Grab />
              Grab a spell to move it horizontally
            </Info>
            <Info>
              <MousePointerClick />
              Select a spell in the timeline
            </Info>
            <Info>
              <Delete />
              Press backspace to delete
            </Info>
            <Info>
              <ChevronUpSquare /> or <ChevronDownSquare />
              Move a spell vertically
            </Info>
          </InfosWrapper>
          <InfosWrapper>
            <InfoTitle>Timeline informations</InfoTitle>
            <Info>
              <Grab />
              Grab the timeline to move it horizontally
            </Info>
            <Info>
              <MoveHorizontal />
              Use the zoom to upscale the timeline
            </Info>
          </InfosWrapper>
          <InfosWrapper>
            <InfoTitle>Row informations</InfoTitle>
            <Info>
              <MousePointerClick />
              Click the row to add a spell
            </Info>
            <Info>
              <GripVertical />
              Access the options of a row
            </Info>
          </InfosWrapper>
        </InfosContainer>
        <TimelineWrapper>
          <OldTimeline />
        </TimelineWrapper>
      </Main>
    </Container>
  );
};

export default Planner;
