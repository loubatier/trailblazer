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

export type TimelineWithRelations = {
  id: string;
  boss_id: string;
  roster_id: string;
  timer: number;
  difficulty: "normal" | "heroic" | "mythic";
  timeline_boss_spells: {
    id: string;
    spell_id: number;
    timeline_id: string;
    timing: number;
    x: number;
    boss_spells: {
      boss_id: string;
      color: string;
      duration: number;
      icon: string;
      id: number;
      name: string;
    };
  }[];
  timeline_roster_rows: {
    is_active: boolean;
    position: number;
    timeline_id: string;
  }[];
  timeline_character_spells: {
    id: string;
    row: number;
    spell_id: number;
    timeline_id: string;
    timing: number;
    x: number;
    character_spells: {
      class_id: string | null;
      color: string;
      cooldown: number;
      duration: number;
      icon: string;
      id: number;
      name: string;
      spec_id: string | null;
    };
  }[];
};

export type Timeline = {
  id: string;
  rosterId: string;
  bossId: string;
  difficulty: "normal" | "heroic" | "mythic";
  timer: number;
};

export type EnrichedTimeline = Timeline & {
  // bossSpells: TimelineBossSpell[];
  // rosterRows: TimelineRosterRow[];
  // characterSpells: TimelineCharacterSpell[];
};

export type Spell = {
  id: number;
  icon: string;
  name: string;
  color: string;
  duration: number;
  cooldown?: number;
};

export type RosterSpell = Spell & {
  characterId: string;
};

// TODO: timelineBossSpellId becomes id and Spell Omit id replaced by spellId
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

export type TimelineRosterRow = {
  id: string;
  timelineId: string;
  position: number;
  isActive: boolean;
};

export type Roster = {
  id: string;
  guildId: string;
  name: string;
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
