import { NextApiRequest, NextApiResponse } from "next";
import { Spell } from "../../components/healing-rotation/canvas";
import { supabase } from "../../lib/supabaseClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { rosterId } = req.query;

  if (!rosterId || typeof rosterId !== "string") {
    return res.status(400).json({ error: "Invalid rosterId" });
  }

  try {
    // Fetch characters and their classes and specs in a single query
    const { data: rosterCharacters, error: rosterError } = await supabase
      .from("roster_characters")
      .select("character_id, characters(class_id, spec_id)")
      .eq("roster_id", rosterId);

    if (rosterError) throw rosterError;

    const characters = rosterCharacters.map((rc) => rc.characters);

    const classIds = characters
      .map((char: { class_id: string | null }) => char.class_id)
      .filter((id) => id !== null);
    const specIds = characters
      .map((char: { spec_id: string | null }) => char.spec_id)
      .filter((id) => id !== null);

    // Fetch spells and join classes and specs in a single query
    const { data: spells, error: spellsError } = await supabase
      .from("character_spells")
      .select("*, classes(color), specs(class_id)")
      .or(
        `class_id.in.(${classIds.join(",")}),spec_id.in.(${specIds.join(",")})`
      );

    if (spellsError) throw spellsError;

    // Fetch all classes and specs in a single query
    const { data: classAndSpecs, error: classAndSpecsError } = await supabase
      .from("classes")
      .select("id, color, specs(id, class_id)");

    if (classAndSpecsError) throw classAndSpecsError;

    // Create a map for quick class color lookup
    const classColorMap = classAndSpecs.reduce(
      (acc: Record<string, string>, cls: { id: string; color: string }) => {
        acc[cls.id] = cls.color;
        return acc;
      },
      {}
    );

    // Create a map for quick spec to class lookup
    const specClassMap = classAndSpecs.reduce(
      (
        acc: Record<string, string>,
        cls: { id: string; specs: { id: string; class_id: string }[] }
      ) => {
        cls.specs.forEach((spec) => {
          acc[spec.id] = cls.id; // Ensure we're mapping the spec id to the class id
        });
        return acc;
      },
      {}
    );

    // Add the color to each spell and map to Spell type
    const spellsWithColor: Spell[] = spells.map((spell) => {
      let color = "";
      if (spell.class_id) {
        color = classColorMap[spell.class_id];
      } else if (spell.spec_id) {
        const classId = specClassMap[spell.spec_id];
        color = classColorMap[classId];
      }

      return {
        id: spell.id,
        icon: spell.icon,
        name: spell.name,
        duration: spell.duration,
        cooldown: spell.cooldown,
        color: color,
      };
    });

    res.status(200).json(spellsWithColor);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch spells", details: error.message });
  }
};

export default handler;
