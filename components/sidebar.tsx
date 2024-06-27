import React, { useEffect, useState } from "react";
import { find } from "lodash";
import { GanttChart, Home, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useUserGuilds } from "../lib/hooks/useUserGuilds";
import { useGuildMemberStore } from "../lib/stores/useGuildStore";
import { Select } from "./sharedstyles";

const Root = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 64px;
  height: 100%;
  background-color: #23262b;
`;

const Container = styled.div``;

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Sidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const userId = session?.user?.supabaseId;
  const { data: fetchedGuilds } = useUserGuilds(userId);

  const { currentGuild, guilds, setCurrentGuild, setGuilds } =
    useGuildMemberStore();

  useEffect(() => {
    if (fetchedGuilds) {
      setGuilds(fetchedGuilds);
      if (fetchedGuilds.length > 0) {
        setCurrentGuild(fetchedGuilds[0]);
      }
    }
  }, [fetchedGuilds, setCurrentGuild, setGuilds]);

  const handleGuildChange = (guildId: string) => {
    const guild = find(guilds, (guild) => guild.id === guildId);
    setCurrentGuild(guild);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <Root>
      <Container>
        <Action>
          <Home onClick={() => router.push("/")} />
        </Action>
        <Action>
          <GanttChart onClick={() => router.push("/planner")} />
        </Action>
      </Container>
      <Container>
        <Action>
          <LogOut onClick={handleSignOut} color="red" />
        </Action>
        {guilds && (
          <Select
            value={currentGuild ? currentGuild.id : ""}
            onChange={(e) => handleGuildChange(e.target.value)}
          >
            <option value="" disabled selected hidden>
              Select a guild
            </option>
            {guilds.map((guild) => (
              <option key={guild.battlenet_id} value={guild.id}>
                {guild.name}
              </option>
            ))}
          </Select>
        )}
        {session && <p>{session.user.name}</p>}
      </Container>
    </Root>
  );
};

export default Sidebar;
