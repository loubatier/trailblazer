import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { raidId } = req.query;

  if (!raidId || typeof raidId !== "string") {
    return res.status(400).json({ error: "Invalid raidId" });
  }

  try {
    // Fetch bosses for the given raid ID
    const { data: bosses, error: bossesError } = await supabase
      .from("bosses")
      .select("*")
      .eq("raid_id", raidId);

    if (bossesError) throw bossesError;

    res.status(200).json(bosses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch bosses", details: error.message });
  }
};

export default handler;
