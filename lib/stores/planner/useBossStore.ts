import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Boss, Difficulty } from "../../types/planner/timeline";

interface BossStore {
  bosses: Boss[];
  currentBoss: Boss;
  difficulty: Difficulty;
  setBosses: (bosses: Boss[]) => void;
  setCurrentBoss: (boss: Boss) => void;
  setDifficulty: (difficulty: Difficulty) => void;
}

export const useBossStore = create<BossStore>()(
  persist(
    (set) => ({
      bosses: [],
      currentBoss: null,
      difficulty: Difficulty.Heroic,

      setBosses: (bosses: Boss[]) => set({ bosses }),
      setCurrentBoss: (boss: Boss) => set({ currentBoss: boss }),
      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
    }),
    {
      name: "boss-storage",
    }
  )
);
