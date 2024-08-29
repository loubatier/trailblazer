import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, newTiming } = req.body;

  if (!id || newTiming === undefined) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    const { error: updateError } = await supabase
      .from("timeline_boss_spells")
      .update({ timing: newTiming })
      .eq("id", id);

    if (updateError) throw updateError;

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update timeline boss spell",
      details: (error as Error).message,
    });
  }
};

export default handler;
