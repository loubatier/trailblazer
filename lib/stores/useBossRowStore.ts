import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BossTimelineRow,
  BossTimelineSpell,
} from "../../components/healing-rotation/canvas";
import { ETimelineRowType } from "../../data/models/timeline";

interface BossRowStore {
  count: number;
  row: BossTimelineRow;
  spells: BossTimelineSpell[];

  updateSpellTiming: (spellIndex: number, x: number, zoom: number) => void;
  updateBossRowStatus: (isLocked: boolean) => void;
  resetBossRowTimers: () => void;
}

const SPELLS: BossTimelineSpell[] = [
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
  {
    duration: 8,
    cooldown: 120,
    color: "#6843A2",
    icon: "https://assets2.lorrgs.io/images/spells/ability_soulrenderdormazain_hellscream.jpg",

    x: 200,
    timing: 100,
    isSelected: false,
  },
];

const BOSS_ROW: BossTimelineRow = {
  type: ETimelineRowType.BOSS,
  isLocked: false,
};

export const useBossRowStore = create<BossRowStore>()(
  persist(
    (set) => ({
      count: 12,
      row: BOSS_ROW,
      spells: SPELLS,

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
          spells: SPELLS,
        });
      },
    }),
    {
      name: "boss-row-storage",
    }
  )
);
