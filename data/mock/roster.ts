import {
  Character,
  ECharacterRole,
  ESignupStatus,
  Encounter,
  Signup,
} from "../models/roster";

const getRandomCharacter = (): Character => {
  return {
    id: 234112,
    name: "Hilderion",
    realm: "Ysondre",
    class: "Druid",
    role: ECharacterRole.Heal,
  };
};

export const getRandomSignups = (amount = 5): Signup[] => {
  const rules = [];
  for (let i = 0; i < amount; i++) {
    rules.push({
      character: getRandomCharacter(),
      status: ESignupStatus.PRESENT,
      comment: "",
      selected: true,
      class: "Druid", // Duplicated with Character.class
      role: "Healer",
    });
  }
  return rules;
};

const getRandomSelections = (amount = 5): Selection[] => {
  const selections = [];
  for (let i = 0; i < amount; i++) {
    selections.push({
      character_id: 234112,
      selected: true,
      class: "Druid", // Hunter
      role: "Healer", // Ranged
      wishlist_score: 4,
    });
  }
  return selections;
};

export const getRandomEncounters = (amount = 5): Encounter[] => {
  const encounters = [];
  for (let i = 0; i < amount; i++) {
    encounters.push({
      id: 121331,
      name: "Gnarlroot", // Smolderon
      enabled: true,
      notes: "",
      selections: getRandomSelections(),
    });
  }
  return encounters;
};
