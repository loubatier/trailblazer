import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
import { Boss } from "../../lib/types/planner/timeline";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { raidId } = req.query;

  if (!raidId || typeof raidId !== "string") {
    return res.status(400).json({ error: "Invalid raidId" });
  }

  try {
    const { data: bosses, error: bossesError } = await supabase
      .from("bosses")
      .select("*")
      .eq("raid_id", raidId)
      .order("position", { ascending: true });

    if (bossesError) throw bossesError;

    const raidBosses: Boss[] = bosses.map((boss) => ({
      id: boss.id,
      raidId: boss.raid_id,
      icon: boss.icon,
      name: boss.name,
      slug: boss.slug,
    }));

    res.status(200).json(raidBosses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch bosses", details: error.message });
  }
};

export default handler;
