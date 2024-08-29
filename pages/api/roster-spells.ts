import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";
import { RosterSpell } from "../../lib/types/planner/timeline";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { rosterId } = req.query;

  if (!rosterId || typeof rosterId !== "string") {
    return res.status(400).json({ error: "Invalid rosterId" });
  }

  try {
    // Fetch characters and their classes and specs in a single query
    const { data: rosterCharacters, error: rosterError } = await supabase
      .from("roster_characters")
      .select("id, class_id, spec_id")
      .eq("roster_id", rosterId);

    if (rosterError) throw rosterError;

    if (!rosterCharacters || rosterCharacters.length === 0) {
      return res.status(200).json([]); // Return an empty array if no characters found
    }

    const classIds = rosterCharacters
      .map((char) => char.class_id)
      .filter((id): id is string => id !== null);
    const specIds = rosterCharacters
      .map((char) => char.spec_id)
      .filter((id): id is string => id !== null);

    // Fetch spells and join classes and specs in a single query
    const { data: spells, error: spellsError } = await supabase
      .from("character_spells")
      .select("*")
      .or(
        `class_id.in.(${classIds.join(",")}),spec_id.in.(${specIds.join(",")})`
      );

    if (spellsError) throw spellsError;

    const characterMap = new Map<string, string>();
    rosterCharacters.forEach((char) => {
      if (char.class_id) characterMap.set(char.class_id, char.id);
      if (char.spec_id) characterMap.set(char.spec_id, char.id);
    });

    // Transform spells into RosterSpell format
    const rosterSpells: RosterSpell[] = spells.map((spell) => {
      const characterId =
        characterMap.get(spell.class_id || "") ||
        characterMap.get(spell.spec_id || "") ||
        "Unknown";

      return {
        id: spell.id,
        icon: spell.icon,
        name: spell.name,
        color: spell.color,
        duration: spell.duration,
        cooldown: spell.cooldown ?? undefined,
        characterId,
      };
    });

    res.status(200).json(rosterSpells);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch spells", details: error.message });
  }
};

export default handler;
