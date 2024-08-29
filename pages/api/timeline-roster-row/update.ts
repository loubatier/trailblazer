import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, newPosition, newIsActive } = req.body;

  if (!id || (newPosition === undefined && newIsActive === undefined)) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    const { data, error: updateError } = await supabase.rpc(
      "update_timeline_roster_row",
      {
        row_id: id,
        new_position: newPosition ?? null,
        new_is_active: newIsActive ?? null,
      }
    );

    if (updateError) throw updateError;

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update timeline roster row",
      details: (error as Error).message,
    });
  }
};

export default handler;
