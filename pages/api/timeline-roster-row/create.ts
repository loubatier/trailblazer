import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { timelineId, position, isActive } = req.body;

  if (!timelineId || position === undefined || isActive === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
      .from("timeline_roster_rows")
      .insert({
        timeline_id: timelineId,
        position,
        is_active: isActive,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create timeline roster row",
      details: error.message,
    });
  }
};

export default handler;
