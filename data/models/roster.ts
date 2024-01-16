export interface Encounter {
  id: number;
  name: string; // Smolderon
  enabled: boolean;
  notes: string;
  selections: Selection[];
}

export interface Selection {
  character_id: number;
  selected: boolean;
  class: string; // Hunter
  role: string; // Ranged
  wishlist_score: number;
}

export interface Signup {
  character: Character;
  status: ESignupStatus;
  comment: string;
  selected: boolean;
  class: string; // Duplicated with Character.class
  role: string; // Duplicated with Character.role
}

export enum ESignupStatus {
  PRESENT = "Present",
  ABSENT = "Absent",
}

export enum EClassColor {
  Death_Knight = "#C41E3A",
  Demon_Hunter = "#A330C9",
  Druid = "#FF7C0A",
  Evoker = "#33937F",
  Hunter = "#AAD372",
  Mage = "#3FC7EB",
  Monk = "#00FF98",
  Paladin = "#F48CBA",
  Priest = "#FFFFFF",
  Rogue = "#FFF468",
  Shaman = "#0070DD",
  Warlock = "#8788EE",
  Warrior = "#C69B6D",
}

export interface Character {
  id: number;
  name: string;
  realm: string;
  class: string;
  role: string;
}
