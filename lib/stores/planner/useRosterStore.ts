import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Roster, RosterSpell } from "../../types/planner/timeline";

interface TimelineStore {
  roster: Roster;
  characters: any[];
  availableSpells: RosterSpell[];
  setRoster: (roster: Roster) => void;
}

export const useRosterStore = create<TimelineStore>()(
  persist(
    (set) => ({
      roster: null,
      characters: [],
      availableSpells: [],
      setRoster: (roster: Roster) => set({ roster }),
    }),
    {
      name: "roster-storage",
    }
  )
);
