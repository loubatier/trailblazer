import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Boss, Difficulty } from "../../types/planner/timeline";

interface BossStore {
  boss: Boss;
  difficulty: Difficulty;
  setBoss: (boss: Boss) => void;
  setDifficulty: (difficulty: Difficulty) => void;
}

export const useBossStore = create<BossStore>()(
  persist(
    (set) => ({
      boss: null,
      difficulty: Difficulty.Heroic,

      setBoss: (boss: Boss) => set({ boss }),
      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
    }),
    {
      name: "boss-storage",
    }
  )
);
