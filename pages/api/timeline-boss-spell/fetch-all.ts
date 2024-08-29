import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { timelineId } = req.query;

  if (!timelineId || typeof timelineId !== "string") {
    return res.status(400).json({ error: "Invalid or missing timelineId" });
  }

  try {
    const { data, error } = await supabase
      .from("timeline_boss_spells")
      .select("*, boss_spells(*)")
      .eq("timeline_id", timelineId);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch timeline boss spells",
      details: error.message,
    });
  }
};

export default handler;
