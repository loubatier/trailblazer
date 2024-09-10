// Guild
// - id - battlenet_id - name - realm - region
// Roster
// - id - guild_id - name
// Timeline
// - id - roster_id - boss_id - difficulty - timer
// Boss
// - id - raid_id - icon - name
// BossSpell
// - id - boss_id - icon - name - duration
// TimelineBossSpell
// - BossSpell & { - id - timeline_id - spell_id - timing - x }
// Roster
// - id - guild_id - name
// TimelineRosterRow
// - timeline_id - position - is_active
// RosterSpell
// - id - class_id? - spec_id? - icon - name - duration - cooldown - color
// TimelineRosterSpell
// - RosterSpell & { - id - timeline_id - spell_id - row - timing - x }

import { Character, Role } from "./roster";

export type Timeline = {
  id: string;
  rosterId: string;
  bossId: string;
  difficulty: "normal" | "heroic" | "mythic";
  timer: number;
};

// ------------------------- SPELLS

export type Spell = {
  id: number;
  icon: string;
  name: string;
  color: string;
  duration: number;
  cooldown?: number;
};

export type RosterSpell = Spell & {
  character?: Pick<Character, "id" | "name">;
};

export type TimelineBossSpell = Omit<Spell, "id"> & {
  id: string;
  spellId: number;
  timing: number;
};

export type DefaultBossSpell = Omit<TimelineBossSpell, "id" | "timelineId">;

export type TimelineCharacterSpell = Omit<RosterSpell, "id"> & {
  id: string;
  spellId: number;
  timing: number;
  rowId: string;
  isSelected: boolean;
};

export type SpellFilter = "everyone" | Role | Character["id"];

export type TimelineRosterRow = {
  id: string;
  timelineId: string;
  position: number;
  isActive: boolean;
};

export type Raid = {
  id: string;
  name: string;
  slug: string;
};

export type Boss = {
  id: string;
  raidId: string;
  icon: string;
  name: string;
  slug: string;
};

export enum Difficulty {
  Normal = "normal",
  Heroic = "heroic",
  Mythic = "mythic",
}

export enum BossSpellType {
  AOE = "Raid AOE",
  DOT = "Raid DOT",
  Soak = "Raid Soak",
  Targeted = "Targeted",
  Dispell = "Dispell",
  Event = "Event",
  Movement = "Movement",
}

export enum CharacterSpellType {
  Major = "Major cooldown",
  Minor = "Minor cooldown",
  External = "External",
  Mobility = "Mobility",
}

export const bossSpellTypeColors = {
  "Raid AOE": "#FF5733",
  "Raid DOT": "#8B00FF",
  "Raid Soak": "#0077BE",
  Targeted: "#E67e22",
  Dispell: "#32CD32",
  Event: "#FF69B4",
  Movement: "#1E90FF",
};
