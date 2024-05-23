import React from "react";
import {
  ArrowBigUpDash,
  Delete,
  Grab,
  GripVertical,
  MoveHorizontal,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styled from "styled-components";
import { Description, Main, Title } from "../components/sharedstyles";

const TimelineWrapper = dynamic(
  () => import("../components/healing-rotation/timeline-wrapper"),
  {
    ssr: false,
  }
);

const InfosContainer = styled.div`
  display: flex;
  padding: 48px;
  gap: 96px;
`;

const InfosWrapper = styled.div``;

const InfoTitle = styled.p`
  font-size: 24px;
  font-weight: 100;
  margin-bottom: 24px;
  padding-left: 16px;
  border-left: 3px solid white;
`;

const Info = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Planner = () => {
  return (
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
            <Delete />
            Select a spell and press backspace to delete
          </Info>
          <Info>
            <ArrowBigUpDash />
            Press shift and grab a spell to move it verticaly
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
            <GripVertical />
            Access the options of a row
          </Info>
        </InfosWrapper>
      </InfosContainer>

      <TimelineWrapper />
    </Main>
  );
};

export default Planner;
