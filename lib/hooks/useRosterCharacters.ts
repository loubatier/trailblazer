import { useEffect, useState } from "react";
import { Character } from "../types/planner/roster";

export const fetchRosterCharacters = async (
  rosterId: string
): Promise<Character[]> => {
  const response = await fetch(`/api/roster-characters?rosterId=${rosterId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch roster characters");
  }

  const data = await response.json();
  return data;
};

const useRosterCharacters = (rosterId: string) => {
  const [rosterCharacters, setRosterCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rosterId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRosterCharacters(rosterId);
        setRosterCharacters(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rosterId]);

  return { rosterCharacters, isLoading, error };
};

export default useRosterCharacters;
