// pages/api/timeline-boss-spell/reset-all.ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";
import { DefaultBossSpell } from "../../../lib/types/planner/timeline";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    timelineId,
    defaultSpells,
  }: {
    timelineId: string;
    bossId: string;
    defaultSpells: DefaultBossSpell[];
  } = req.body;

  if (!timelineId || !defaultSpells) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    // Delete existing boss spells for the timeline
    const { error: deleteError } = await supabase
      .from("timeline_boss_spells")
      .delete()
      .eq("timeline_id", timelineId);

    if (deleteError) throw deleteError;

    // Prepare payload for inserting default spells
    const payload = defaultSpells.map((spell) => ({
      timeline_id: timelineId,
      spell_id: spell.spellId,
      timing: spell.timing,
    }));

    // Insert default boss spells
    const { data, error: insertError } = await supabase
      .from("timeline_boss_spells")
      .insert(payload)
      .select(`*, boss_spells (*)`);

    if (insertError) throw insertError;

    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({
      error: "Failed to reset timeline boss spells",
      details: error.message,
    });
  }
}
