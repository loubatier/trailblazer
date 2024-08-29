import { create } from "zustand";

interface Guild {
  id: string;
  name: string;
  battlenet_id: number;
  realm: string;
  region: string;
}

interface GuildState {
  currentGuild: Guild | null;
  guilds: Guild[];
  setCurrentGuild: (guild: Guild) => void;
  setGuilds: (guilds: Guild[]) => void;
}

export const useGuildStore = create<GuildState>((set) => ({
  currentGuild: null,
  guilds: [],

  setCurrentGuild: async (currentGuild: Guild) => set({ currentGuild }),
  setGuilds: async (guilds: Guild[]) =>
    set({
      guilds,
    }),
}));
