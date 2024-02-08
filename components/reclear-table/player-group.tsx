import React from "react";
import styled from "styled-components";
import { EClassColor, Encounter, Signup } from "../../data/models/roster";
import {
  getVaultAmountColor,
  isPlayerSelectedForEncounter,
  replaceWhitespaceWithUnderscore,
} from "../../lib/utils";
import { lowerCase, map } from "lodash";
import Player from "./player";

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
          <PlayerRow key={player.character.id}>
            <Player player={player.character} />
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
