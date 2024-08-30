import React, { useState } from "react";
import { isEmpty } from "lodash";
import { ArrowRightToLine, Copy } from "lucide-react";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import RosterTable from "../components/roster-table";
import { Description, Main, Title } from "../components/sharedstyles";
import { captureComponent } from "../lib/screenshot";

const RosterWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin: auto;
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
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  opacity: ${({ isDisabled }) => (isDisabled ? "0.5" : "1")};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "all")};
`;

const Roster = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [raidId, setRaidId] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setRaidId(inputValue);
    }
  };

  return (
    <Main>
      {isMobile ? (
        <>Go get a computer</>
      ) : (
        <>
          <Title>Roster Page</Title>
          <Description>
            <Link href="/">&larr; Go Back</Link>
          </Description>

          <Actions>
            <ScreenshotButton
              isDisabled={false}
              onClick={() => {
                captureComponent("roster-table");
              }}
            >
              <Copy />
            </ScreenshotButton>
            <InputWrapper>
              <Input
                type="text"
                placeholder="wowaudit raidId"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
              ></Input>
            </InputWrapper>
            <ScreenshotButton
              isDisabled={isEmpty(inputValue)}
              onClick={() => setRaidId(inputValue)}
            >
              <ArrowRightToLine />
            </ScreenshotButton>
          </Actions>

          <RosterWrapper>
            <RosterTable raidId={raidId} />
          </RosterWrapper>
        </>
      )}
    </Main>
  );
};

export default Roster;
