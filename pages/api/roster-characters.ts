import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
import { Character } from "../../lib/types/planner/roster";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { rosterId } = req.query;

  if (!rosterId || typeof rosterId !== "string") {
    return res.status(400).json({ error: "Invalid rosterId" });
  }

  try {
    const { data: rosterCharacters, error: rosterError } = await supabase
      .from("roster_characters")
      .select("*, character_classes(*), character_specs(*)")
      .eq("roster_id", rosterId);

    if (rosterError) throw rosterError;

    if (!rosterCharacters || rosterCharacters.length === 0) {
      return res.status(200).json([]); // Return an empty array if no characters found
    }

    const characters: Character[] = rosterCharacters.map((character) => {
      return {
        id: character.id,
        rosterId: character.roster_id,
        name: character.name,
        classId: character.class_id,
        specId: character.spec_id,
      };
    });

    res.status(200).json(characters);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch characters", details: error.message });
  }
};

export default handler;
