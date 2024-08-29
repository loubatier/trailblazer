import { create } from "zustand";
import { RealtimeChannel } from "@supabase/supabase-js";
import { omitId } from "../../../pages/api/timeline";
import { getBaseTimelineBossSpell } from "../../mock/planner/timeline";
import { supabase } from "../../supabaseClient";
import {
  Boss,
  Raid,
  Spell,
  TimelineBossSpell,
} from "../../types/planner/timeline";

const updateTimelineBossSpell = async (id: string, newTiming?: number) => {
  const response = await fetch("/api/timeline-boss-spell/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, newTiming }),
  });

  if (!response.ok) {
    throw new Error("Failed to update timeline boss spell");
  }
};

const resetTimelineBossSpells = async (
  timelineId: string,
  defaultSpells: TimelineBossSpell[]
) => {
  const response = await fetch("/api/timeline-boss-spell/reset-all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timelineId,
      defaultSpells,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to reset timeline boss spells");
  }

  return await response.json();
};

type TimelineBossSpellsStore = {
  timelineId: string;
  bossId: Boss["id"];
  isLocked: boolean;
  timelineBossSpells: TimelineBossSpell[];
  lastId: TimelineBossSpell["id"];
  allBossSpells: Spell[];
  realtimeChannel: RealtimeChannel;
  setTimelineId: (timelineId: string) => void;
  setBossId: (bossId: Boss["id"]) => void;
  setIsLocked: (isLocked: boolean) => void;
  fetchTimelineBossSpells: () => Promise<void>;
  fetchAllBossSpells: () => Promise<void>;
  subscribeToRealtimeUpdates: () => void;
  unsubscribeFromRealtimeUpdates: () => void;
  updateBossSpellTiming: (id: string, newTiming: number) => Promise<void>;
  setBossSpellTiming: (id: TimelineBossSpell["id"], newTiming: number) => void;
  resetBossSpells: (
    bossSlug: Boss["slug"],
    raidSlug: Raid["slug"]
  ) => Promise<void>;
};

export const useTimelineBossSpellsStore = create<TimelineBossSpellsStore>(
  (set, get) => ({
    timelineId: null,
    bossId: null,
    isLocked: true,
    timelineBossSpells: [],
    lastId: null,
    allBossSpells: [],
    realtimeChannel: null,

    setTimelineId: (timelineId: string) => {
      set({ timelineId });
    },

    setBossId: (bossId: string) => {
      set({ bossId });
    },

    setIsLocked: (isLocked: boolean) => {
      set({ isLocked });
    },

    fetchTimelineBossSpells: async () => {
      const { timelineId } = get();
      if (!timelineId) {
        console.error("No timelineId set");
        return;
      }

      try {
        set({ timelineBossSpells: [] });

        const response = await fetch(
          `/api/timeline-boss-spell/fetch-all?timelineId=${timelineId}`
        );
        const data = await response.json();

        const timelineBossSpells: TimelineBossSpell[] = data.map((spell) => ({
          id: spell.id,
          spellId: spell.boss_spells.id,
          timing: spell.timing,
          ...omitId(spell.boss_spells),
        }));

        set({ timelineBossSpells });
      } catch (error) {
        console.error("Error fetching character spells:", error);
      }
    },

    fetchAllBossSpells: async () => {
      try {
        const { data, error } = await supabase
          .from("boss_spells")
          .select("*")
          .eq("boss_id", get().bossId);

        if (error) throw error;

        set({ allBossSpells: data });
      } catch (error) {
        console.error("Error fetching boss spells:", error);
      }
    },

    subscribeToRealtimeUpdates: () => {
      const { timelineId } = get();
      if (!timelineId) {
        console.error("No timelineId set");
        return;
      }

      const channel = supabase
        .channel(`timeline_boss_spells`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "timeline_boss_spells",
            filter: `timeline_id=eq.${timelineId}`,
          },
          async (payload) => {
            const { eventType, new: newSpell, old: oldSpell } = payload;
            const currentSpells = get().timelineBossSpells;

            if (eventType === "INSERT") {
              const existingSpell = currentSpells.find(
                (spell) => spell.id === newSpell.id
              );

              if (existingSpell) return;

              const associatedSpell = get().allBossSpells.find(
                (spell) => spell.id === newSpell.spell_id
              );

              if (associatedSpell) {
                set((state) => ({
                  timelineBossSpells: [
                    ...state.timelineBossSpells,
                    getBaseTimelineBossSpell(
                      newSpell.id,
                      associatedSpell,
                      newSpell.timing
                    ),
                  ],
                }));
              }
            } else if (eventType === "UPDATE") {
              if (newSpell.id === get().lastId) return;

              set((state) => ({
                timelineBossSpells: state.timelineBossSpells.map((spell) =>
                  spell.id === newSpell.id
                    ? {
                        ...spell,
                        timing: newSpell.timing,
                      }
                    : spell
                ),
              }));
            } else if (eventType === "DELETE") {
              set((state) => ({
                timelineBossSpells: state.timelineBossSpells.filter(
                  (spell) => spell.id !== oldSpell.id
                ),
              }));
            }
          }
        )
        .subscribe();

      set({ realtimeChannel: channel });
    },

    unsubscribeFromRealtimeUpdates: () => {
      const channel = get().realtimeChannel;
      if (channel) {
        supabase.removeChannel(channel);
        set({ realtimeChannel: null });
      }
    },

    updateBossSpellTiming: async (id, newTiming) => {
      const previousSpells = get().timelineBossSpells;
      set((state) => ({
        timelineCharacterSpells: state.timelineBossSpells.map((tbs) =>
          tbs.id === id ? { ...tbs, timing: newTiming } : tbs
        ),
        lastId: id,
      }));

      try {
        await updateTimelineBossSpell(id, newTiming);
      } catch (error) {
        console.error("Error updating character spell timing:", error);
        set({ timelineBossSpells: previousSpells, lastId: null });
      }
    },

    setBossSpellTiming: (id, newTiming) => {
      set((state) => ({
        timelineBossSpells: state.timelineBossSpells.map((tbs) =>
          tbs.id === id ? { ...tbs, timing: newTiming } : tbs
        ),
      }));
    },

    resetBossSpells: async (bossSlug: Boss["slug"], raidSlug: Raid["slug"]) => {
      const timelineId = get().timelineId;

      if (!timelineId) {
        console.error("No timelineId set");
        return;
      }

      try {
        const { defaultBossSpells } = await import(
          `../../../data/default-boss-spells/${raidSlug}/${bossSlug}.ts`
        );

        if (!defaultBossSpells) {
          set({
            timelineBossSpells: [],
          });
          return;
        }

        const tempSpells: TimelineBossSpell[] = defaultBossSpells.map(
          (spell, index) => ({
            ...spell,
            id: `temp-${Date.now()}-${index}`,
            timelineId: timelineId,
          })
        );

        set({
          timelineBossSpells: [...tempSpells],
        });

        const { data } = await resetTimelineBossSpells(
          timelineId,
          defaultBossSpells
        );

        const savedSpells = data.map((spell) =>
          getBaseTimelineBossSpell(spell.id, spell.boss_spells, spell.timing)
        );

        set({
          timelineBossSpells: savedSpells,
        });
      } catch (error) {
        console.error("Failed to reset boss spells:", error);
      }
    },
  })
);
