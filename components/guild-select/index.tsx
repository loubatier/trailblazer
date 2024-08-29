import React, { useEffect } from "react";
import { find } from "lodash";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import { useUserGuilds } from "../../lib/hooks/useUserGuilds";
import { useGuildStore } from "../../lib/stores/useGuildStore";

const Root = styled.select`
  width: 100%;
  padding: 16px;
  outline: none;
  border-radius: 0;
`;

const GuildSelect = () => {
  const { data: session } = useSession();
  const userId = session?.user?.supabaseId;
  const { data: fetchedGuilds } = useUserGuilds(userId);

  const { currentGuild, guilds, setCurrentGuild, setGuilds } = useGuildStore();

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

  return (
    <Root
      value={currentGuild ? currentGuild.id : ""}
      onChange={(e) => handleGuildChange(e.target.value)}
    >
      <option value="" disabled hidden>
        Select a guild
      </option>
      {guilds.map((guild) => (
        <option key={guild.id} value={guild.id}>
          {guild.name} {guild.realm}-{guild.region}
        </option>
      ))}
    </Root>
  );
};

export default GuildSelect;
