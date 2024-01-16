import Link from "next/link";
import {
  Container,
  Main,
  Title,
  Description,
} from "../components/sharedstyles";
import styled from "styled-components";
import { ArrowRightToLine, Copy } from "lucide-react";
import { captureComponent } from "../lib/screenshot";
import ReclearTable from "../components/roster/reclear-table";
import { useState } from "react";

const Roster = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin: auto;
  padding: 40px 0;
  background-color: ${({ theme }) => theme.colors.application_background};
`;

const Actions = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  margin: 40px auto 0 auto;
  gap: 12px;
`;

const InputWrapper = styled.div`
  @keyframes gradient {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100% 0;
    }
  }

  position: relative;
  display: flex;
  flex-direction: row;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.content_background};

  &:after {
    content: "";
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 2px;
    background-position: 0% 0%;
    background: linear-gradient(
      to right,
      #b294ff,
      #57e6e6,
      #feffb8,
      #57e6e6,
      #b294ff,
      #57e6e6
    );
    background-size: 500% auto;
    animation: gradient 3s linear infinite;
    transition: height 0.25s ease-in-out;
  }
`;

const Input = styled.input`
  flex-grow: 1;
  color: white;
  font-size: 16px;
  vertical-align: middle;
`;

const ScreenshotButton = styled.button<{ isDisabled: boolean }>`
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  opacity: ${({ isDisabled }) => (isDisabled ? "0.5" : "1")};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "all")};
`;

const About: React.FC = () => {
  const [raidId, setRaidId] = useState<string>("");

  // Handle change in input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRaidId(e.target.value);
  };

  return (
    <Container>
      <Main>
        <Title>Team Page</Title>
        <Description>
          <Link href="/">&larr; Go Back</Link>
        </Description>

        <Actions>
          <ScreenshotButton
            isDisabled={false}
            onClick={() => {
              captureComponent("reclear-roster");
            }}
          >
            <Copy />
          </ScreenshotButton>
          <InputWrapper>
            <Input
              type="email"
              placeholder="Raid ID"
              onChange={(e) => handleInputChange(e)}
            ></Input>
          </InputWrapper>
        </Actions>

        <Roster id="reclear-roster">
          <ReclearTable raid={raidId} />
        </Roster>
      </Main>
    </Container>
  );
};

export default About;
