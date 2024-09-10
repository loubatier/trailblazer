import { useQuery } from "react-query";
import { Boss } from "../types/planner/timeline";

export const fetchRaidBosses = async (raidId: string): Promise<Boss[]> => {
  const response = await fetch(`/api/raid-bosses?raidId=${raidId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch raid bosses");
  }

  const data = await response.json();
  return data;
};

const useRaidBosses = (raidId: string) => {
  return useQuery<Boss[], Error>(
    ["raidBosses", raidId],
    () => fetchRaidBosses(raidId),
    {
      enabled: !!raidId,
      retry: 1,
    }
  );
};

export default useRaidBosses;
