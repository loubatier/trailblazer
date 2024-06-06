import { isNil } from "lodash";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BossTimelineRow,
  ETimelineRowType,
  Spell,
  TimelineRow,
  TimelineSpell,
} from "../../components/healing-rotation/canvas";

const SPELLS: TimelineSpell[] = [
  {
    duration: 8,
    cooldown: 120,
    color: "#33937f",
    icon: "https://assets.lorrgs.io/images/spells/ability_evoker_stasis.jpg",

    x: 0,
    timing: 0,
    row: 0,
    isActive: true,
    isSelected: false,
  },
  {
    duration: 8,
    cooldown: 120,
    color: "#33937f",
    icon: "https://assets.lorrgs.io/images/spells/ability_evoker_stasis.jpg",

    x: 270,
    timing: 135,
    row: 1,
    isActive: true,
    isSelected: false,
  },
  {
    duration: 8,
    cooldown: 120,
    color: "#33937f",
    icon: "https://assets.lorrgs.io/images/spells/ability_evoker_stasis.jpg",

    x: 200,
    timing: 100,
    row: 2,
    isActive: false,
    isSelected: false,
  },
];

const BOSS_ROW: BossTimelineRow = {
  type: ETimelineRowType.BOSS,
  isActive: true,
};

const ROWS: TimelineRow[] = [
  { type: ETimelineRowType.BASE, isActive: true },
  { type: ETimelineRowType.BASE, isActive: true },
  { type: ETimelineRowType.BASE, isActive: false },
  { type: ETimelineRowType.BASE, isActive: true },
];

interface TimelineStore {
  offset: number;
  isDragging: boolean;
  zoom: number;
  spells: TimelineSpell[];
  bossRow: BossTimelineRow;
  rows: TimelineRow[];

  updateTimelineZoom: (z: number) => void;

  addTimelineSpell: (spell: Spell, rowIndex: number, x: number) => void;
  deleteTimelineSpell: (i: number) => void;
  selectTimelineSpell: (i: number) => void;
  updateTimelineSpellTiming: (i: number, x: number) => void;
  updateTimelineSpellRow: (i: number, rowIndex: number) => void;

  addTimelineRow: () => void;
  deleteTimelineRow: (i: number) => void;
  updateTimelineRowStatus: (i: number, isActive: boolean) => void;
  updateTimelineRowPosition: (index: number, newIndex: number) => void;

  clearTimelineSpellSelection: () => void;
  clearTimeline: () => void;
  moveTimeline: (x: number) => void;
  toggleTimelineDrag: (isDragging: boolean) => void;
}

export const useTimelineStore = create<TimelineStore>()(
  persist(
    (set) => ({
      offset: 0,
      isDragging: false,
      zoom: 3,
      spells: SPELLS,
      bossRow: BOSS_ROW,
      rows: ROWS,

      clearTimelineSpellSelection: () => {
        set((state) => ({
          ...state,
          spells: state.spells.map((spell) => ({
            ...spell,
            isSelected: false,
          })),
        }));
      },

      updateTimelineZoom: (zoom: number) =>
        set((state) => ({
          ...state,
          zoom,
          spells: state.spells.map((spell) => ({
            ...spell,
            x: spell.timing * zoom,
          })),
        })),

      selectTimelineSpell: (spellIndex: number) => {
        set((state) => {
          const spells = state.spells.map((spell, i) =>
            i === spellIndex
              ? { ...spell, isSelected: !spell.isSelected }
              : { ...spell, isSelected: false }
          );

          const selectedSpell = spells.find((spell) => spell.isSelected);

          if (selectedSpell) {
            spells.splice(spells.indexOf(selectedSpell), 1);
            spells.push(selectedSpell);
          }

          return {
            ...state,
            spells,
          };
        });
      },

      addTimelineSpell: (spell: Spell, rowIndex: number, x: number) => {
        set((state) => ({
          ...state,
          spells: [
            ...state.spells,
            {
              ...spell,
              row: rowIndex,
              x,
              timing: x / state.zoom,
              isActive: state.rows[rowIndex].isActive,
              isSelected: false,
            },
          ],
        }));
      },

      deleteTimelineSpell: (rowIndex: number) => {
        set((state) => ({
          ...state,
          spells: state.spells.filter((_, i) => i !== rowIndex),
        }));
      },

      addTimelineRow: () => {
        set((state) => ({
          ...state,
          rows: [
            ...state.rows,
            { type: ETimelineRowType.BASE, isActive: true },
          ],
        }));
      },

      deleteTimelineRow: (rowIndex: number) => {
        set((state) => ({
          ...state,
          spells: state.spells
            .filter((spell) => spell.row !== rowIndex)
            .map((spell) => ({
              ...spell,
              row: spell.row > rowIndex ? spell.row - 1 : spell.row,
            })),
          rows: state.rows.filter((_, i) => rowIndex !== i),
        }));
      },

      updateTimelineRowStatus: (rowIndex: number, isActive: boolean) => {
        set((state) => ({
          ...state,
          rows: state.rows.map((row, i) =>
            i === rowIndex ? { ...row, isActive } : row
          ),
          spells: state.spells.map((spell) =>
            spell.row === rowIndex ? { ...spell, isActive } : spell
          ),
        }));
      },

      updateTimelineRowPosition: (
        initialRowIndex: number,
        newRowIndex: number
      ) => {
        const isHigherIndex = newRowIndex > initialRowIndex;
        const refinedNewRowIndex = isHigherIndex
          ? newRowIndex - 1
          : newRowIndex;

        set((state) => {
          state.spells = state.spells.map((spell) => {
            if (spell.row === initialRowIndex) {
              return { ...spell, row: refinedNewRowIndex };
            } else if (
              initialRowIndex < refinedNewRowIndex &&
              spell.row > initialRowIndex &&
              spell.row <= refinedNewRowIndex
            ) {
              return { ...spell, row: spell.row - 1 };
            } else if (
              initialRowIndex > refinedNewRowIndex &&
              spell.row < initialRowIndex &&
              spell.row >= refinedNewRowIndex
            ) {
              return { ...spell, row: spell.row + 1 };
            }
            return spell;
          });

          // Move the timeline row from initialIndex to refinedNewIndex
          const [row] = state.rows.splice(initialRowIndex, 1);
          state.rows.splice(refinedNewRowIndex, 0, row);

          return {
            ...state,
            rows: state.rows,
            spells: state.spells,
          };
        });
      },

      updateTimelineSpellTiming: (spellIndex: number, x: number) => {
        set((state) => ({
          ...state,
          spells: state.spells.map((spell, i) =>
            i === spellIndex ? { ...spell, x, timing: x / state.zoom } : spell
          ),
        }));
      },

      updateTimelineSpellRow: (
        spellIndex: number,
        destinationRowIndex: number
      ) => {
        set((state) => {
          const isValidRowIndex =
            destinationRowIndex >= 0 && destinationRowIndex < state.rows.length;

          const updatedSpells = state.spells.map((spell, i) => {
            if (i === spellIndex) {
              return {
                ...spell,
                row: destinationRowIndex,
                isActive:
                  isValidRowIndex && !isNil(destinationRowIndex)
                    ? state.rows[destinationRowIndex].isActive
                    : spell.isActive,
              };
            }
            return spell;
          });

          return {
            spells: updatedSpells,
          };
        });
      },

      clearTimeline: () => set((state) => ({ ...state, rows: [] })),
      moveTimeline: (x: number) => set((state) => ({ ...state, offset: x })),
      toggleTimelineDrag: (isDragging: boolean) =>
        set((state) => ({ ...state, isDragging })),
    }),
    {
      name: "timeline-storage",
    }
  )
);
