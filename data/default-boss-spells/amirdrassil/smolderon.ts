import {
  DefaultBossSpell,
  Timeline,
} from "../../../lib/types/planner/timeline";

export const defaultBossConfig: {
  timer: Timeline["timer"];
  defaultSpells: DefaultBossSpell[];
} = {
  timer: 420,
  defaultSpells: [
    {
      spellId: 417455,
      icon: "https://assets2.lorrgs.io/images/spells/sha_spell_fire_bluehellfire_nightmare.jpg",
      name: "Dream Rend",
      color: "#FFFFFF",
      duration: 10,
      timing: 15,
    },
    {
      spellId: 417455,
      icon: "https://assets2.lorrgs.io/images/spells/sha_spell_fire_bluehellfire_nightmare.jpg",
      name: "Dream Rend",
      color: "#FFFFFF",
      duration: 10,
      timing: 30,
    },
    {
      spellId: 417455,
      icon: "https://assets2.lorrgs.io/images/spells/sha_spell_fire_bluehellfire_nightmare.jpg",
      name: "Dream Rend",
      color: "#FFFFFF",
      duration: 10,
      timing: 75,
    },
    {
      spellId: 417455,
      icon: "https://assets2.lorrgs.io/images/spells/sha_spell_fire_bluehellfire_nightmare.jpg",
      name: "Dream Rend",
      color: "#FFFFFF",
      duration: 10,
      timing: 90,
    },
  ],
};
