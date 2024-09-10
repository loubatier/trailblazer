import { create } from "zustand";
import { RealtimeChannel } from "@supabase/supabase-js";
import { getBaseTimelineCharacterSpell } from "../../mock/planner/timeline";
import { supabase } from "../../supabaseClient";
import {
  RosterSpell,
  Spell,
  TimelineCharacterSpell,
  TimelineRosterRow,
} from "../../types/planner/timeline";
import { omitId } from "../../utils";

const createTimelineCharacterSpell = async (
  timelineId: string,
  spellId: number,
  timing: number,
  rowId: string,
  characterId: string
) => {
  const response = await fetch("/api/timeline-character-spell/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timelineId, spellId, timing, rowId, characterId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create timeline character spell");
  }

  return await response.json();
};

const deleteTimelineCharacterSpell = async (id: string) => {
  const response = await fetch(
    `/api/timeline-character-spell/delete?id=${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete timeline character spell");
  }
};

const updateTimelineCharacterSpell = async (
  id: string,
  newRowId?: string,
  newTiming?: number
) => {
  const response = await fetch("/api/timeline-character-spell/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, newRowId, newTiming }),
  });

  if (!response.ok) {
    throw new Error("Failed to update timeline character spell");
  }
};

type TimelineCharacterSpellStore = {
  timelineId: string;
  timelineCharacterSpells: TimelineCharacterSpell[];
  lastId: TimelineCharacterSpell["id"];
  allCharacterSpells: Spell[];
  realtimeChannel: RealtimeChannel;
  isLoading: boolean;
  setTimelineId: (timelineId: string) => void;
  fetchTimelineCharacterSpells: () => Promise<void>;
  fetchAllCharacterSpells: () => Promise<void>;
  subscribeToRealtimeUpdates: () => void;
  unsubscribeFromRealtimeUpdates: () => void;
  createCharacterSpell: (
    spell: RosterSpell,
    timing: number,
    rowId: TimelineRosterRow["id"]
  ) => Promise<void>;
  updateCharacterSpellTiming: (
    id: TimelineCharacterSpell["id"],
    newTiming: number
  ) => Promise<void>;
  updateCharacterSpellRow: (
    id: TimelineCharacterSpell["id"],
    rowId: TimelineRosterRow["id"],
    newTiming: number
  ) => Promise<void>;
  setCharacterSpellRow: (
    id: TimelineCharacterSpell["id"],
    newRowId: TimelineRosterRow["id"]
  ) => void;
  setCharacterSpellTiming: (
    id: TimelineCharacterSpell["id"],
    newTiming: number
  ) => void;
  setCharacterSpellSelection: (id: TimelineCharacterSpell["id"]) => void;
  clearCharacterSpellSelection: () => void;
  deleteCharacterSpell: (id: TimelineCharacterSpell["id"]) => Promise<void>;
};

export const useTimelineCharacterSpellStore =
  create<TimelineCharacterSpellStore>((set, get) => ({
    timelineId: null,
    timelineCharacterSpells: [],
    lastId: null,
    allCharacterSpells: [],
    realtimeChannel: null,
    isLoading: false,

    setTimelineId: (timelineId: string) => {
      set({ timelineId });
    },

    fetchTimelineCharacterSpells: async () => {
      const { timelineId } = get();
      if (!timelineId) {
        console.error("No timelineId set");
        return;
      }

      set({ isLoading: true });
      try {
        set({ timelineCharacterSpells: [] });

        const response = await fetch(
          `/api/timeline-character-spell/fetch-all?timelineId=${timelineId}`
        );
        const data = await response.json();

        const timelineCharacterSpells: TimelineCharacterSpell[] = data.map(
          (spell) => ({
            id: spell.id,
            spellId: spell.character_spells.id,
            timing: spell.timing,
            rowId: spell.timeline_roster_rows.id,
            character: spell.roster_characters
              ? {
                  id: spell.roster_characters.id,
                  name: spell.roster_characters.name,
                }
              : null,
            isSelected: false,
            ...omitId(spell.character_spells),
          })
        );

        set({ timelineCharacterSpells });
      } catch (error) {
        console.error("Error fetching character spells:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    fetchAllCharacterSpells: async () => {
      try {
        const { data, error } = await supabase
          .from("character_spells")
          .select("*");

        if (error) throw error;

        set({ allCharacterSpells: data });
      } catch (error) {
        console.error("Error fetching all character spells:", error);
      }
    },

    subscribeToRealtimeUpdates: () => {
      const { timelineId } = get();
      if (!timelineId) {
        console.error("No timelineId set");
        return;
      }

      const channel = supabase
        .channel(`timeline_character_spells`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "timeline_character_spells",
            filter: `timeline_id=eq.${timelineId}`,
          },
          async (payload) => {
            const { eventType, new: newSpell, old: oldSpell } = payload;
            const currentSpells = get().timelineCharacterSpells;

            if (eventType === "INSERT") {
              const existingSpell = currentSpells.find(
                (spell) => spell.id === newSpell.id
              );

              if (existingSpell) return;

              const associatedSpell = get().allCharacterSpells.find(
                (spell) => spell.id === newSpell.spell_id
              );

              if (associatedSpell) {
                const { data: row } = await supabase
                  .from("timeline_roster_rows")
                  .select("id")
                  .eq("id", newSpell.row_id)
                  .single();

                const { data: character } = await supabase
                  .from("roster_characters")
                  .select("id, name")
                  .eq("id", newSpell.character_id)
                  .single();

                const transformedSpell = getBaseTimelineCharacterSpell(
                  newSpell.id,
                  { ...associatedSpell, character },
                  newSpell.timing,
                  row.id
                );

                set((state) => ({
                  timelineCharacterSpells: [
                    ...state.timelineCharacterSpells,
                    transformedSpell,
                  ],
                }));
              }
            } else if (eventType === "UPDATE") {
              if (newSpell.id === get().lastId) return;

              const { data: row } = await supabase
                .from("timeline_roster_rows")
                .select("id")
                .eq("id", newSpell.row_id)
                .single();

              const { data: character } = await supabase
                .from("roster_characters")
                .select("id, name")
                .eq("id", newSpell.character_id)
                .single();

              set((state) => ({
                timelineCharacterSpells: state.timelineCharacterSpells.map(
                  (spell) =>
                    spell.id === newSpell.id
                      ? {
                          ...spell,
                          timing: newSpell.timing,
                          rowId: row.id,
                          character: { id: character.id, name: character.name },
                        }
                      : spell
                ),
              }));
            } else if (eventType === "DELETE") {
              set((state) => ({
                timelineCharacterSpells: state.timelineCharacterSpells.filter(
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

    createCharacterSpell: async (
      spell: RosterSpell,
      timing: number,
      rowId: TimelineRosterRow["id"]
    ) => {
      const { timelineId } = get();
      if (!timelineId) {
        console.error("No timelineId set");
        return;
      }

      const tempId = `temp-${Date.now()}`;
      const tempSpell = getBaseTimelineCharacterSpell(
        tempId,
        spell,
        timing,
        rowId
      );

      set((state) => ({
        timelineCharacterSpells: [
          ...(state.timelineCharacterSpells ?? []),
          tempSpell,
        ],
      }));

      try {
        const data = await createTimelineCharacterSpell(
          timelineId,
          spell.id,
          timing,
          rowId,
          spell.character.id
        );

        set((state) => ({
          timelineCharacterSpells: state.timelineCharacterSpells.map((tcs) =>
            tcs.id === tempId ? { ...tcs, id: data.id } : tcs
          ),
        }));
      } catch (error) {
        console.error("Error creating timeline character spell:", error);
        set((state) => ({
          timelineCharacterSpells: state.timelineCharacterSpells.filter(
            (s) => s.id !== tempId
          ),
        }));
      }
    },

    updateCharacterSpellTiming: async (id, newTiming) => {
      const previousSpells = get().timelineCharacterSpells;
      set((state) => ({
        timelineCharacterSpells: state.timelineCharacterSpells.map((tcs) =>
          tcs.id === id ? { ...tcs, timing: newTiming } : tcs
        ),
        lastId: id,
      }));

      try {
        await updateTimelineCharacterSpell(id, null, newTiming);
      } catch (error) {
        console.error("Error updating character spell timing:", error);
        set({ timelineCharacterSpells: previousSpells, lastId: null });
      }
    },

    updateCharacterSpellRow: async (id, newRowId, newTiming) => {
      const previousSpells = get().timelineCharacterSpells;
      set((state) => ({
        timelineCharacterSpells: state.timelineCharacterSpells.map((tcs) =>
          tcs.id === id ? { ...tcs, rowId: newRowId, timing: newTiming } : tcs
        ),
        lastId: id,
      }));

      try {
        await updateTimelineCharacterSpell(id, newRowId, newTiming);
      } catch (error) {
        console.error("Error updating character spell row:", error);
        set({ timelineCharacterSpells: previousSpells, lastId: null });
      }
    },

    setCharacterSpellRow: (id, newRowId) => {
      set((state) => ({
        timelineCharacterSpells: state.timelineCharacterSpells.map((tcs) =>
          tcs.id === id ? { ...tcs, rowId: newRowId } : tcs
        ),
      }));
    },

    setCharacterSpellTiming: (id, newTiming) => {
      set((state) => ({
        timelineCharacterSpells: state.timelineCharacterSpells.map((tcs) =>
          tcs.id === id ? { ...tcs, timing: newTiming } : tcs
        ),
      }));
    },

    setCharacterSpellSelection: (id) => {
      set((state) => ({
        timelineCharacterSpells: state.timelineCharacterSpells.map((tcs) =>
          tcs.id === id
            ? { ...tcs, isSelected: !tcs.isSelected }
            : { ...tcs, isSelected: false }
        ),
      }));
    },

    clearCharacterSpellSelection: () => {
      set((state) => ({
        timelineCharacterSpells: state.timelineCharacterSpells.map((tcs) => ({
          ...tcs,
          isSelected: false,
        })),
      }));
    },

    deleteCharacterSpell: async (id) => {
      const previousSpells = get().timelineCharacterSpells;

      set((state) => ({
        timelineCharacterSpells: state.timelineCharacterSpells.filter(
          (spell) => spell.id !== id
        ),
      }));

      try {
        await deleteTimelineCharacterSpell(id);
      } catch (error) {
        console.error("Error deleting character spell:", error);
        set({ timelineCharacterSpells: previousSpells });
      }
    },
  }));
