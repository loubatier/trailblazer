// Import necessary modules
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Character,
  EClassColor,
  Encounter,
  Signup,
} from "../../data/models/roster";
import styled from "styled-components";
import {
  ArrowRight,
  ArrowRightCircle,
  ArrowRightFromLine,
  ArrowRightToLine,
  Copy,
} from "lucide-react";
import { captureComponent } from "../../lib/screenshot";

interface IProps {
  raid: string;
}

const StatusBox = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 48px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.application_background};
  font-weight: bold;
  text-transform: uppercase;
  color: ${({ isSelected }) => (isSelected ? "#2ECC71" : "#E74C3C")};
  background-color: ${({ theme }) => theme.colors.content_background};
`;

const NumberBox = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 48px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.application_background};
  background-color: ${({ color }) => color};
`;

const EncountersWrapper = styled.div`
  display: flex;
  gap: 2px;
  margin-left: 202px;
  margin-bottom: 2px;
`;

const StatusRows = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
`;

const Player = styled.div<{ color: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  width: 200px;
  height: 48px;
  padding-left: 12px;
  background-color: ${({ theme }) => theme.colors.content_background};
  border-left: 4px solid ${({ color }) => color};
  border-bottom: 1px solid ${({ theme }) => theme.colors.application_background};

  p {
    font-size: 16px;
    font-weight: bold;
  }
`;

const isPlayerSelectedForEncounter = (
  player: Signup,
  encounter: Encounter
): boolean => {
  return encounter.selections?.some(
    (selection) =>
      selection.character_id === player.character.id && selection.selected
  );
};

const isPlayerSelectedForAnyEncounter = (
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

const getVaultAmountColor = (value: number): string => {
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

const replaceWhitespaceWithUnderscore = (input: string): string => {
  return input.replace(/\s/g, "_").toLowerCase();
};

// Component to fetch and display raid data
const ReclearTable: React.FC<IProps> = ({ raid }) => {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  const { data, isLoading, error } = useQuery(
    ["raidData", raid],
    () =>
      axios
        .get(
          `https://wowaudit.com/v1/raids/${raid}?api_key=43b8bea3357ac3a65a9a75ccd363ec85b722006e6efeaf92f6c1f9e38d8cab30`
        )
        .then((res) => res.data),
    {
      enabled: !!raid,
      retry: false,
    }
  );

  useEffect(() => {
    if (data) {
      setSignups(data.signups as Signup[]);
      setEncounters(data.encounters as Encounter[]);
    }
  }, [data]);

  const roster = signups.filter((player) => player);

  // Render component
  return (
    <div>
      {isLoading && <p>IS LOADING</p>}

      {data && (
        <>
          {/* Encounters portraits */}
          <EncountersWrapper>
            {encounters.map(
              (encounter) =>
                encounter.enabled && (
                  <img
                    src={`/bosses/${replaceWhitespaceWithUnderscore(
                      encounter.name
                    )}.png`}
                    alt={encounter.name}
                    width={68}
                    height={90}
                  />
                )
            )}
            <img src={`/vault.png`} alt={`vault`} width={60} height={80} />
          </EncountersWrapper>

          <StatusRows>
            {/* Player identity column  */}
            <div>
              {roster.map((player) => (
                <Player
                  color={
                    EClassColor[replaceWhitespaceWithUnderscore(player.class)]
                  }
                >
                  <img
                    src={`/classes/${replaceWhitespaceWithUnderscore(
                      player.class
                    )}.webp`}
                    alt={`${player.class} icon`}
                    width={24}
                    height={24}
                  />

                  <p>{player.character.name}</p>
                </Player>
              ))}
            </div>

            {/* Player selection column */}
            {encounters.map(
              (encounter, i) =>
                encounter.enabled && (
                  <div key={i}>
                    {roster.map((player, i) => {
                      const isSelectedForEncounter =
                        isPlayerSelectedForEncounter(player, encounter);
                      return (
                        <StatusBox key={i} isSelected={isSelectedForEncounter}>
                          {isSelectedForEncounter ? "In" : "Out"}
                        </StatusBox>
                      );
                    })}
                  </div>
                )
            )}

            {/* Vault amount column  */}
            <div>
              {roster.map((player, i) => {
                const selectedCount = encounters.reduce((count, encounter) => {
                  const isSelected = isPlayerSelectedForEncounter(
                    player,
                    encounter
                  );
                  return isSelected ? count + 1 : count;
                }, 0);

                return (
                  <NumberBox key={i} color={getVaultAmountColor(selectedCount)}>
                    {selectedCount}
                  </NumberBox>
                );
              })}
            </div>
          </StatusRows>
        </>
      )}
    </div>
  );
};

export default ReclearTable;
