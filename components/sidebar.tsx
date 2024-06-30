import React, { useState } from "react";
import { ArrowRightFromLine, GanttChart, Home, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styled from "styled-components";
import GuildSelect from "./guild-select";

const Root = styled.div<{ isOpened: boolean }>`
  position: absolute;
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
  padding: 16px;

  svg {
    flex-shrink: 0;
  }
`;

const Sidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpened, setIsOpened] = useState(true);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleOpenSidebar = () => setIsOpened(!isOpened);

  return (
    <Root isOpened={isOpened}>
      <Container>
        <Action>
          {session && <p>{session.user.name}</p>}
          <LogOut onClick={handleSignOut} color="red" />
        </Action>
        <Action>
          <ArrowRightFromLine onClick={handleOpenSidebar} />
        </Action>
        <Action>
          <Home onClick={() => router.push("/")} />
          <p>Home</p>
        </Action>
        <Action>
          <GanttChart onClick={() => router.push("/planner")} />
          <p>Planner</p>
        </Action>
      </Container>
      <Container>
        <GuildSelect />
      </Container>
    </Root>
  );
};

export default Sidebar;
