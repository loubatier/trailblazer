import { filter } from "lodash";
import {
  ECharacterRole,
  ESignupStatus,
  Encounter,
  RosterPlayer,
  Selection,
  Signup,
} from "../data/models/roster";

export const getPlayerFromSignup = (signup: Signup): RosterPlayer => {
  return {
    name: signup.character.name,
    class: signup.class,
  };
};

export const getPlayerFromSelection = (selection: Selection): RosterPlayer => {
  return null;
};

export const replaceWhitespaceWithUnderscore = (input: string): string => {
  return input.replace(/\s/g, "_");
};

export const getAllAbsentSignups = (signups: Signup[]): Signup[] => {
  return filter(signups, (signup) => signup.status === ESignupStatus.ABSENT);
};

export const getAllNonSelectedForEncounter = (
  selections: Selection[],
  signups: Signup[]
): RosterPlayer[] => {
  const nonSelectedCharacterIds = selections
    .filter((selection) => !selection.selected)
    .map((selection) => selection.character_id);

  // Step 2: Filter out non-selected signups and transform into RosterPlayer format.
  const nonSelectedRosterPlayers = signups
    .filter(
      (signup) =>
        nonSelectedCharacterIds.includes(signup.character.id) &&
        !signup.selected
    )
    .map((signup) => ({
      name: signup.character.name,
      class: signup.character.class, // Assuming you want the class from the Character object
    }));

  return nonSelectedRosterPlayers;
};

export const hasOnlyOneEnabledEncounter = (
  encounters: Encounter[]
): boolean => {
  const enabledEncounters = filter(encounters, { enabled: true });
  return enabledEncounters.length === 1;
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
    "#E73C3C",
    "#E74C3C",
    "#E76F3C",
    "#E7843C",
    "#E7A33C",
    "#E7C13C",
    "#E7E03C",
    "#2ECC71",
  ];

  return value >= MAX_VAULT_VALUE ? colors[MAX_VAULT_VALUE] : colors[value];
};

export const getRosterKeyFromCharacterRole = (role: ECharacterRole): string =>
  role.toLowerCase();
