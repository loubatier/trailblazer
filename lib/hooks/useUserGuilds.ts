import { useQuery } from "react-query";
import { supabase } from "../supabaseClient";

const fetchUserGuilds = async (userId) => {
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

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => item.guilds);
};

export const useUserGuilds = (userId) => {
  return useQuery(["userGuilds", userId], () => fetchUserGuilds(userId), {
    enabled: !!userId, // Only run the query if userId is provided
  });
};
