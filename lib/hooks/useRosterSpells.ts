import { useEffect, useState } from "react";
import { Spell } from "../../components/healing-rotation/canvas";

export const fetchRosterSpells = async (rosterId: string): Promise<Spell[]> => {
  const response = await fetch(`/api/roster-spells?rosterId=${rosterId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch roster spells");
  }

  const data = await response.json();
  return data;
};

const useRosterSpells = (rosterId: string) => {
  const [rosterSpells, setRosterSpells] = useState<Spell[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rosterId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRosterSpells(rosterId);
        setRosterSpells(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rosterId]);

  return { rosterSpells, isLoading, error };
};

export default useRosterSpells;
