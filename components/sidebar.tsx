import React from "react";
import { GanttChart, Home, Users } from "lucide-react";
import { useRouter } from "next/router";
import styled from "styled-components";
import GuildSelect from "./guild-select";

const Root = styled.div<{ isOpened: boolean }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ isOpened }) => (isOpened ? "200px" : "64px")};
  height: 100%;
  background-color: #23262b;
  transition: width 0.33s ease-in-out;
  z-index: 1000;
`;

const Container = styled.div``;

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;

  svg {
    flex-shrink: 0;
  }
`;

const Sidebar = () => {
  const router = useRouter();

  return (
    <Root isOpened={false}>
      <Container>
        <Action>
          <Home onClick={() => router.push("/")} />
        </Action>
        <Action>
          <Users onClick={() => router.push("/roster")} />
        </Action>
        <Action>
          <GanttChart onClick={() => router.push("/planner")} />
        </Action>
      </Container>
      <Container>
        <GuildSelect />
      </Container>
    </Root>
  );
};

export default Sidebar;
