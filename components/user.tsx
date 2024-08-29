import React from "react";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaBattleNet } from "react-icons/fa6";
import styled from "styled-components";

const Root = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #23262b;
  transition: width 0.33s ease-in-out;
  z-index: 1000;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;

  svg {
    flex-shrink: 0;
  }
`;

const User = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <Root>
      <Action>
        <FaBattleNet />
        {session && <p>{session.user.name}</p>}
        <LogOut onClick={handleSignOut} color="red" />
      </Action>
    </Root>
  );
};

export default User;
