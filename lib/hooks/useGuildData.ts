import axios from "axios";
import { useQuery } from "react-query";
import { supabase } from "../supabaseClient";

const fetchGuildData = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, { region, server, guild }] = queryKey;
  try {
    const response = await axios.get(`/api/guild`, {
      params: { region, server, guild },
    });

    const { data: existingGuild, error } = await supabase
      .from("guilds")
      .select("*")
      .eq("battlenet_id", response.data.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking guild existence:", error);
      return false;
    }

    if (!existingGuild) {
      const { error: insertError } = await supabase
        .from("guilds")
        .insert([
          {
            name: response.data.name,
            battlenet_id: response.data.id,
            realm: response.data.realm.name,
          },
        ])
        .single();

      if (insertError) {
        console.error("Error creating guild:", insertError);
        return false;
      }
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const useGuildData = (region, server, guild) => {
  return useQuery(["guild", { region, server, guild }], fetchGuildData, {
    enabled: false,
    retry: false,
    onError: (error: Error) => error,
  });
};
