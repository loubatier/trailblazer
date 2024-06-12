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

const INITIAL_BOSS_SPELLS: { [bossName: string]: BossTimelineSpell[] } = {
  Gnarlroot: [
    {
      duration: 8,
      cooldown: 120,
      color: "#6843A2",
      icon: "https://assets2.lorrgs.io/images/spells/ability_soulrenderdormazain_hellscream.jpg",
      x: 0,
      timing: 0,
      isSelected: false,
    },
    {
      duration: 8,
      cooldown: 120,
      color: "#6843A2",
      icon: "https://assets2.lorrgs.io/images/spells/ability_soulrenderdormazain_hellscream.jpg",
      x: 270,
      timing: 135,
      isSelected: false,
    },
    // ... other spells for Boss1
  ],
  Smolderon: [
    {
      duration: 10,
      cooldown: 150,
      color: "#A2436A",
      icon: "https://assets2.lorrgs.io/images/spells/ability_soulrenderdormazain_hellscream.jpg",
      x: 50,
      timing: 50,
      isSelected: false,
    },
    // ... other spells for Boss2
  ],
  // Add more bosses and their spells as needed
};

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
          spells: INITIAL_BOSS_SPELLS[boss],
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
        set((state) => ({
          spells: INITIAL_BOSS_SPELLS[state.boss],
        }));
      },
    }),
    {
      name: "boss-row-storage",
    }
  )
);
