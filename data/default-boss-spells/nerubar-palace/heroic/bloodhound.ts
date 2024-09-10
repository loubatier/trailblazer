import {
  DefaultBossSpell,
  Timeline,
} from "../../../../lib/types/planner/timeline";

export const defaultBossConfig: {
  timer: Timeline["timer"];
  defaultSpells: DefaultBossSpell[];
} = {
  timer: 780,
  defaultSpells: [],
};
