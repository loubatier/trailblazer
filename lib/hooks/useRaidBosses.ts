import { useEffect, useState } from "react";
import { Boss } from "../../components/healing-rotation/canvas";

export const fetchRaidBosses = async (raidId: string): Promise<Boss[]> => {
  const response = await fetch(`/api/raid-bosses?raidId=${raidId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch raid bosses");
  }

  const data = await response.json();
  return data;
};

const useRaidBosses = (raidId: string) => {
  const [raidBosses, setRaidBosses] = useState<Boss[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!raidId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRaidBosses(raidId);
        setRaidBosses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [raidId]);

  return { raidBosses, isLoading, error };
};

export default useRaidBosses;
