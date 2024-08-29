import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { spellId, timelineId, timing, rowId, characterId } = req.body;

  if (
    !spellId ||
    !timelineId ||
    timing === undefined ||
    rowId === undefined ||
    characterId === undefined
  ) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    const { data, error } = await supabase
      .from("timeline_character_spells")
      .insert([
        {
          spell_id: spellId,
          timeline_id: timelineId,
          timing,
          row_id: rowId,
          character_id: characterId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create timeline character spell",
      details: (error as Error).message,
    });
  }
};

export default handler;
