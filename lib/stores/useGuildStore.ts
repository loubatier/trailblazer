import { create } from "zustand";

interface Guild {
  id: string;
  name: string;
  battlenet_id: number;
  realm: string;
}

export interface GuildMember {
  guild_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  guild: Guild;
}

interface GuildState {
  currentGuild: Guild | null;
  guilds: Guild[];
  setCurrentGuild: (guild: Guild) => void;
  setGuilds: (guilds: Guild[]) => void;
}

export const useGuildMemberStore = create<GuildState>((set) => ({
  currentGuild: null,
  guilds: [],

  setCurrentGuild: async (currentGuild: Guild) => set({ currentGuild }),
  setGuilds: async (guilds: Guild[]) =>
    set({
      guilds,
    }),
}));
