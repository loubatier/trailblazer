import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
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
    isSelected: false,
  },
];

const ROWS: TimelineRow[] = [
  { isActive: true },
  { isActive: false },
  { isActive: true },
  { isActive: true },
];

interface TimelineStore {
  offset: number;
  isDragging: boolean;
  zoom: number;
  spells: TimelineSpell[];
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
  clear: () => void;
  move: (x: number) => void;
  drag: (isDragging: boolean) => void;
}

export const useTimelineStore = create<TimelineStore>()(
  persist(
    (set) => ({
      offset: 0,
      isDragging: false,
      zoom: 3,
      spells: SPELLS,
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

      updateTimelineZoom: (z: number) =>
        set((state) => ({
          ...state,
          zoom: z,
          spells: state.spells.map((spell) => ({
            ...spell,
            x: spell.timing * z,
          })),
        })),
      selectTimelineSpell: (i: number) => {
        set((state) => {
          const spells = state.spells.map((spell, index) =>
            index === i
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
              isSelected: false,
            },
          ],
        }));
      },
      deleteTimelineSpell: (i: number) => {
        set((state) => ({
          ...state,
          spells: state.spells.filter((_, index) => index !== i),
        }));
      },
      addTimelineRow: () => {
        set((state) => ({
          ...state,
          rows: [...state.rows, { isActive: true }],
        }));
      },
      deleteTimelineRow: (i: number) => {
        set((state) => ({
          ...state,
          spells: state.spells
            .filter((spell) => spell.row !== i)
            .map((spell) => ({
              ...spell,
              row: spell.row > i ? spell.row - 1 : spell.row,
            })),
          rows: state.rows.filter((_, index) => i !== index),
        }));
      },
      updateTimelineRowStatus: (i: number, isActive: boolean) => {
        set((state) => ({
          ...state,
          rows: state.rows.map((row, index) =>
            index === i ? { ...row, isActive } : row
          ),
        }));
      },
      updateTimelineRowPosition: (initialIndex: number, newIndex: number) => {
        const isHigherIndex = newIndex > initialIndex;
        const refinedNewIndex = isHigherIndex ? newIndex - 1 : newIndex;
        set((state) => {
          state.spells = state.spells.map((spell) => {
            if (spell.row === initialIndex) {
              return { ...spell, row: refinedNewIndex };
            } else if (
              initialIndex < refinedNewIndex &&
              spell.row > initialIndex &&
              spell.row <= refinedNewIndex
            ) {
              return { ...spell, row: spell.row - 1 };
            } else if (
              initialIndex > refinedNewIndex &&
              spell.row < initialIndex &&
              spell.row >= refinedNewIndex
            ) {
              return { ...spell, row: spell.row + 1 };
            }
            return spell;
          });

          // Move the timeline row from initialIndex to refinedNewIndex
          const [row] = state.rows.splice(initialIndex, 1);
          state.rows.splice(refinedNewIndex, 0, row);

          return {
            ...state,
            rows: state.rows,
            spells: state.spells,
          };
        });
      },
      updateTimelineSpellTiming: (i: number, x: number) => {
        set((state) => ({
          ...state,
          spells: state.spells.map((spell, index) =>
            index === i ? { ...spell, x, timing: x / state.zoom } : spell
          ),
        }));
      },
      updateTimelineSpellRow: (i: number, destinationRowIndex: number) => {
        set((state) => ({
          ...state,
          spells: state.spells.map((spell, index) => {
            if (index === i) {
              // Ensure destinationRowIndex is within the bounds of the rows array
              const validDestinationRowIndex = Math.min(
                state.rows.length - 1,
                Math.max(0, destinationRowIndex)
              );
              return { ...spell, row: validDestinationRowIndex };
            }
            return spell;
          }),
        }));
      },

      clear: () => set((state) => ({ ...state, rows: [] })),
      move: (x: number) => set((state) => ({ ...state, offset: x })),
      drag: (isDragging: boolean) => set((state) => ({ ...state, isDragging })),
    }),
    {
      name: "timeline-storage",
    }
  )
);
