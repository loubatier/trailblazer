import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    const { error } = await supabase
      .from("timeline_character_spells")
      .delete()
      .eq("id", id as string);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete timeline character spell",
      details: (error as Error).message,
    });
  }
};

export default handler;
