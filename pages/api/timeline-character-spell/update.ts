import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, newRowId, newTiming, newCharacter } = req.body;

  if (!id || (newRowId === undefined && newTiming === undefined)) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    const { error: updateError } = await supabase.rpc(
      "update_timeline_character_spell",
      {
        tcs_id: id,
        new_row: newRowId ?? null,
        new_timing: newTiming ?? null,
        new_character: newCharacter ?? null,
      }
    );

    if (updateError) throw updateError;

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update timeline character spell",
      details: (error as Error).message,
    });
  }
};

export default handler;
