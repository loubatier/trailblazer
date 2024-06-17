import { create } from "zustand";
import { supabase } from "../supabaseClient";

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
  setCurrentGuild: (guildId: string) => void;
  getUserGuilds: (userId: string) => void;
}

export const useGuildMemberStore = create<GuildState>((set) => ({
  currentGuild: null,
  guilds: [],

  setCurrentGuild: async (guildId: string) => {
    const { data, error } = await supabase
      .from("guilds")
      .select(
        `
          id,
          name,
          battlenet_id,
          realm
      `
      )
      .eq("id", guildId)
      .single();

    if (data) {
      set({ currentGuild: data });
    } else if (error) {
      console.error("Error fetching user guilds:", error);
    }
  },
  getUserGuilds: async (userId: string) => {
    const { data, error } = await supabase
      .from("guild_members")
      .select(
        `
        guilds (
          id,
          name,
          battlenet_id,
          realm
        )
      `
      )
      .eq("user_id", userId);

    if (data) {
      const guilds = data.map((item) => item.guilds);
      const currentGuild = guilds.length > 0 ? guilds[0] : null;

      set({
        guilds,
        currentGuild,
      });
    } else if (error) {
      console.error("Error fetching user guilds:", error);
    }
  },
}));
