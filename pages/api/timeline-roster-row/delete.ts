import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    // Use the Supabase RPC to delete the row and reorder remaining rows
    const { error: deleteError } = await supabase.rpc(
      "delete_timeline_roster_row",
      {
        row_id: id as string,
      }
    );

    if (deleteError) throw deleteError;

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete timeline roster row",
      details: (error as Error).message,
    });
  }
}
