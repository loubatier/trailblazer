import {
  RosterSpell,
  Spell,
  TimelineBossSpell,
  TimelineCharacterSpell,
  TimelineRosterRow,
} from "../../types/planner/timeline";

export const getBaseTimelineCharacterSpell = (
  id: string,
  spell: RosterSpell,
  timing: number,
  rowId: TimelineRosterRow["id"]
): TimelineCharacterSpell => {
  return {
    icon: spell.icon,
    name: spell.name,
    color: spell.color,
    duration: spell.duration,
    cooldown: spell.cooldown,
    id,
    spellId: spell.id,
    timing,
    rowId,
    character: spell.character,
    isSelected: false,
  };
};

export const getBaseTimelineBossSpell = (
  id: string,
  spell: Spell,
  timing: number
): TimelineBossSpell => {
  return {
    id,
    timing,
    spellId: spell.id,
    icon: spell.icon,
    name: spell.name,
    color: spell.color,
    duration: spell.duration,
  };
};
