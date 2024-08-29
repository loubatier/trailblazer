import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../../supabaseClient";
import {
  Difficulty,
  Timeline,
  TimelineBossSpell,
} from "../../types/planner/timeline";

interface TimelineStore {
  timeline: Timeline;
  isLoading: boolean;

  fetchTimeline: (
    rosterId: string,
    bossId: string,
    difficulty: Difficulty
  ) => Promise<void>;
  createTimeline: (
    rosterId: string,
    raidSlug: string,
    bossId: string,
    bossSlug: string,
    difficulty: Difficulty
  ) => Promise<void>;

  zoom: number;
  offset: number;
  isDragging: boolean;

  // updateTimelineZoom: (z: number) => void;
  moveTimeline: (x: number) => void;
  toggleIsDragging: () => void;
  clearTimeline: () => void;
}

export const useTimelineStore = create<TimelineStore>()(
  persist(
    (set, get) => ({
      timeline: null,
      isLoading: false,

      fetchTimeline: async (
        rosterId: string,
        bossId: string,
        difficulty: Difficulty
      ) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from("timelines")
            .select("*")
            .eq("roster_id", rosterId)
            .eq("boss_id", bossId)
            .eq("difficulty", difficulty)
            .single();

          if (error) {
            throw error;
          }

          const timeline = {
            id: data.id,
            rosterId: data.roster_id,
            bossId: data.boss_id,
            difficulty: data.difficulty,
            timer: data.timer,
          };

          set({ timeline });
        } catch (error) {
          console.error("Error fetching timeline:", error);
          set({ timeline: undefined });
        } finally {
          set({ isLoading: false });
        }
      },
      createTimeline: async (
        rosterId: string,
        raidSlug: string,
        bossId: string,
        bossSlug: string,
        difficulty: Difficulty
      ) => {
        set({ isLoading: true });
        try {
          const { defaultBossConfig } = await import(
            `../../../data/default-boss-spells/${raidSlug}/${bossSlug}.ts`
          );

          if (!defaultBossConfig) return;

          const {
            data: { id: timelineId },
            error: createError,
          } = await supabase
            .from("timelines")
            .insert([
              {
                roster_id: rosterId,
                boss_id: bossId,
                difficulty,
                timer: defaultBossConfig.timer,
              },
            ])
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          set({
            timeline: {
              id: timelineId,
              rosterId,
              bossId,
              difficulty,
              timer: defaultBossConfig.timer,
            },
          });

          const bossSpells: TimelineBossSpell[] =
            defaultBossConfig.defaultSpells.map((spell) => ({
              ...spell,
              timelineId,
            }));

          const payload = bossSpells.map((spell) => ({
            timeline_id: timelineId,
            spell_id: spell.spellId,
            timing: spell.timing,
          }));

          const { error: insertBossSpellsError } = await supabase
            .from("timeline_boss_spells")
            .insert(payload);

          if (insertBossSpellsError) {
            throw insertBossSpellsError;
          }

          // Step 3: Create default timeline roster rows
          const defaultRosterRows = [
            { timeline_id: timelineId, position: 0 },
            { timeline_id: timelineId, position: 1 },
          ];

          const { error: insertRosterRowsError } = await supabase
            .from("timeline_roster_rows")
            .insert(defaultRosterRows);

          if (insertRosterRowsError) {
            throw insertRosterRowsError;
          }
        } catch (error) {
          console.error("Error creating timeline:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      zoom: 2.5,
      offset: 0,
      isDragging: false,

      // updateTimelineZoom: (zoom: number) =>
      //   set((state) => ({
      //     ...state,
      //     zoom,
      //     // TODO: Remember when implementing the change of zoom, to acknowledge this side effect
      //     spells: state.spells.map((spell) => ({
      //       ...spell,
      //       x: spell.timing * zoom,
      //     })),
      //   })),
      toggleIsDragging: () =>
        set((state) => ({ ...state, isDragging: !get().isDragging })),
      moveTimeline: (x: number) => set((state) => ({ ...state, offset: x })),
      clearTimeline: () => set((state) => ({ ...state, rows: [] })),
    }),
    {
      name: "timeline-storage",
    }
  )
);
