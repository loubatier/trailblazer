import React from "react";
import styled from "styled-components";
import { EClassColor, Encounter, Signup } from "../../data/models/roster";
import {
  getVaultAmountColor,
  isPlayerSelectedForEncounter,
  replaceWhitespaceWithUnderscore,
} from "../../lib/utils";
import { lowerCase, map } from "lodash";

interface IProps {
  className?: string;
  players: Signup[];
  encounters: Encounter[];
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const PlayerRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1px;
`;

const Player = styled.div<{ color: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 200px;
  height: 48px;
  padding-left: 12px;
  background-color: ${({ theme }) => theme.colors.content_background};
  border-left: 4px solid ${({ color }) => color};

  p {
    font-size: 16px;
    font-weight: bold;
  }
`;

const StatusRows = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1px;
`;

const StatusBox = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 48px;
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

const PlayerGroup: React.FC<IProps> = ({ className, players, encounters }) => {
  return (
    <Root className={className}>
      {map(players, (player) => {
        const selectedCount = encounters.reduce((count, encounter) => {
          const isSelected = isPlayerSelectedForEncounter(player, encounter);
          return isSelected ? count + 1 : count;
        }, 0);

        return (
          <PlayerRow>
            <Player
              key={player.character.id}
              color={EClassColor[replaceWhitespaceWithUnderscore(player.class)]}
            >
              <img
                src={`/classes/${replaceWhitespaceWithUnderscore(
                  lowerCase(player.class)
                )}.webp`}
                alt={`${player.class} icon`}
                width={24}
                height={24}
              />

              <p>{player.character.name}</p>
            </Player>
            <StatusRows>
              {encounters.map((encounter, i) => {
                const isSelected = isPlayerSelectedForEncounter(
                  player,
                  encounter
                );
                return (
                  encounter.enabled && (
                    <StatusBox key={i} isSelected={isSelected}>
                      {isSelected ? "In" : "Out"}
                    </StatusBox>
                  )
                );
              })}
              <NumberBox color={getVaultAmountColor(selectedCount)}>
                {selectedCount}
              </NumberBox>
            </StatusRows>
          </PlayerRow>
        );
      })}
    </Root>
  );
};

export default PlayerGroup;
