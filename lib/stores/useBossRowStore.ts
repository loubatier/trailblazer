import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BossTimelineRow,
  BossTimelineSpell,
} from "../../components/healing-rotation/canvas";
import { ETimelineRowType } from "../../data/models/timeline";

interface BossRowStore {
  boss: string;
  row: BossTimelineRow;
  spells: BossTimelineSpell[];

  setBoss: (boss: string) => void;
  updateSpellTiming: (spellIndex: number, x: number, zoom: number) => void;
  updateBossRowStatus: (isLocked: boolean) => void;
  resetBossRowTimers: () => void;
}

const BOSS_ROW: BossTimelineRow = {
  type: ETimelineRowType.BOSS,
  isLocked: false,
};

export const useBossRowStore = create<BossRowStore>()(
  persist(
    (set) => ({
      boss: "",
      row: BOSS_ROW,
      spells: [],

      setBoss: (boss) => {
        set({
          boss,
          spells: [],
        });
      },

      updateSpellTiming: (spellIndex: number, x: number, zoom: number) => {
        set((state) => ({
          spells: state.spells.map((spell, i) =>
            i === spellIndex ? { ...spell, x, timing: x / zoom } : spell
          ),
        }));
      },

      updateBossRowStatus: (isLocked: boolean) => {
        set((state) => ({
          row: { ...state.row, isLocked },
        }));
      },

      resetBossRowTimers: () => {
        set({
          spells: [],
        });
      },
    }),
    {
      name: "boss-row-storage",
    }
  )
);
