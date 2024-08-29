import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { timelineId } = req.query;

  if (!timelineId || typeof timelineId !== "string") {
    return res.status(400).json({ error: "Invalid or missing timelineId" });
  }

  try {
    const { data, error } = await supabase
      .from("timeline_roster_rows")
      .select("*")
      .eq("timeline_id", timelineId)
      .order("position", { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch timeline roster rows",
      details: error.message,
    });
  }
};

export default handler;
