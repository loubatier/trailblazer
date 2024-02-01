import { ECharacterRole, Encounter, Signup } from "../data/models/roster";

export const replaceWhitespaceWithUnderscore = (input: string): string => {
  return input.replace(/\s/g, "_");
};

export const isPlayerSelectedForAnyEncounter = (
  player: Signup,
  encounters: Encounter[]
): boolean => {
  return encounters.some((encounter) =>
    encounter.selections?.some(
      (selection) =>
        selection.character_id === player.character.id && selection.selected
    )
  );
};

export const isPlayerSelectedForEncounter = (
  player: Signup,
  encounter: Encounter
): boolean => {
  return encounter.selections?.some(
    (selection) =>
      selection.character_id === player.character.id && selection.selected
  );
};

export const getVaultAmountColor = (value: number): string => {
  const MAX_VAULT_VALUE = 7;
  const colors = [
    "#E74C3C",
    "#E76F3C",
    "#E7843C",
    "#E7A33C",
    "#E7C13C",
    "#E7E03C",
    "#2ECC71",
  ];

  return value >= MAX_VAULT_VALUE
    ? colors[MAX_VAULT_VALUE - 1]
    : colors[value - 1];
};

export const getRosterKeyFromCharacterRole = (role: ECharacterRole): string =>
  role.toLowerCase();
