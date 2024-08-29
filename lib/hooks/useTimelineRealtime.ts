import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { EnrichedTimeline } from "../types/planner/timeline";

export const fetchEnrichedTimeline = async (
  rosterId: string,
  bossId: string,
  difficulty: string
): Promise<EnrichedTimeline> => {
  const response = await fetch(
    `/api/timeline?rosterId=${rosterId}&bossId=${bossId}&difficulty=${difficulty}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch enriched timeline");
  }

  const data = await response.json();
  return data;
};

const useTimelineRealtime = (
  rosterId: string,
  bossId: string,
  difficulty: string
) => {
  const [timeline, setTimeline] = useState<EnrichedTimeline | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rosterId || !bossId || !difficulty) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchEnrichedTimeline(rosterId, bossId, difficulty);
        setTimeline(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rosterId, bossId, difficulty]);

  useEffect(() => {
    if (!timeline) return;

    const subscriptions = [
      {
        table: "timelines",
        filter: `id=eq.${timeline.id}`,
      },
      {
        table: "timeline_boss_spells",
        filter: `timeline_id=eq.${timeline.id}`,
      },
      {
        table: "timeline_roster_rows",
        filter: `timeline_id=eq.${timeline.id}`,
      },
      {
        table: "timeline_character_spells",
        filter: `timeline_id=eq.${timeline.id}`,
      },
    ];

    const subscriptionsChannels = subscriptions.map(({ table, filter }) =>
      supabase
        .channel(`public:${table}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table,
            filter,
          },
          () => {
            // Refetch the updated timeline when any change is detected
            fetchEnrichedTimeline(
              timeline.rosterId,
              timeline.bossId,
              timeline.difficulty
            )
              .then(setTimeline)
              .catch(setError);
          }
        )
        .subscribe()
    );

    return () => {
      subscriptionsChannels.forEach((subscription) => {
        supabase.removeChannel(subscription);
      });
    };
  }, [timeline]);

  return { timeline, isLoading, error };
};

export default useTimelineRealtime;
