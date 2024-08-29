import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
import { EnrichedTimeline } from "../../lib/types/planner/timeline";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { rosterId, bossId, difficulty } = req.query;

  if (!rosterId || !bossId || !difficulty) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // Fetch the timeline based on rosterId, bossId, and difficulty
    const { data: timeline, error: timelineError } = await supabase
      .from("timelines")
      .select("*")
      .eq("roster_id", rosterId)
      .eq("boss_id", bossId)
      .eq("difficulty", difficulty)
      .single();

    if (timelineError || !timeline)
      throw timelineError || new Error("Timeline not found");

    // Fetch related boss spells
    // const { data: bossSpells, error: bossSpellsError } = await supabase
    //   .from("timeline_boss_spells")
    //   .select(
    //     `
    //     id,
    //     spell_id,
    //     timing,
    //     boss_spells(id, icon, name, color, duration)
    //   `
    //   )
    //   .eq("timeline_id", timeline.id);

    // if (bossSpellsError) throw bossSpellsError;

    // Fetch related roster rows
    // const { data: rosterRows, error: rosterRowsError } = await supabase
    //   .from("timeline_roster_rows")
    //   .select("*")
    //   .eq("timeline_id", timeline.id)
    //   .order("position", { ascending: true });

    // if (rosterRowsError) throw rosterRowsError;

    // Fetch related character spells
    // const { data: characterSpells, error: characterSpellsError } =
    //   await supabase
    //     .from("timeline_character_spells")
    //     .select(
    //       `
    //     id,
    //     spell_id,
    //     timing,
    //     timeline_roster_rows(id),
    //     character_spells(id, icon, name, color, duration, cooldown)
    //   `
    //     )
    //     .eq("timeline_id", timeline.id);

    // if (characterSpellsError) throw characterSpellsError;

    // Construct the EnrichedTimeline
    const enrichedTimeline: EnrichedTimeline = {
      id: timeline.id,
      rosterId: timeline.roster_id,
      bossId: timeline.boss_id,
      difficulty: timeline.difficulty,
      timer: timeline.timer,
      // bossSpells: bossSpells.map((spell) => ({
      //   id: spell.id,
      //   spellId: spell.boss_spells.id,
      //   x: spell.x,
      //   timing: spell.timing,
      //   isSelected: false,
      //   ...omitId(spell.boss_spells),
      // })),
      // rosterRows: rosterRows.map((row) => ({
      //   id: row.id,
      //   timelineId: row.timeline_id,
      //   position: row.position,
      //   isActive: row.is_active,
      // })),
      // characterSpells: characterSpells.map((spell) => ({
      //   id: spell.id,
      //   spellId: spell.character_spells.id,
      //   timing: spell.timing,
      //   rowId: spell.timeline_roster_rows.id,
      //   isSelected: false,
      //   ...omitId(spell.character_spells),
      // })),
    };

    res.status(200).json(enrichedTimeline);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch enriched timeline",
      details: error.message,
    });
  }
};

export const omitId = <T extends { id: number }>(obj: T): Omit<T, "id"> => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { id, ...rest } = obj;
  return rest;
};

export default handler;
