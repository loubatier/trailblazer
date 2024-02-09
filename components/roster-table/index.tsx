import React, { useEffect, useState } from "react";
import axios from "axios";
import { map } from "lodash";
import { useQuery } from "react-query";
import styled from "styled-components";
import { Encounter, Roster, Signup } from "../../data/models/roster";
import {
  getAllAbsentSignups,
  getAllNonSelectedForEncounter,
  getRosterFromEncounter,
  getRosterFromSignups,
  hasOnlyOneEnabledEncounter,
  replaceWhitespaceWithUnderscore,
} from "../../lib/utils";
import Player from "./player";
import PlayerGroup from "./player-group";

interface IProps {
  raidId: string;
}

const Root = styled.div`
  padding: 48px;
  background-color: ${({ theme }) => theme.colors.application_background};
`;

const EncounterWrapper = styled.div``;

const EncountersWrapper = styled.div`
  display: flex;
  gap: 1px;
  margin-left: 201px;
  margin-bottom: 24px;
`;

const StyledPlayerGroup = styled(PlayerGroup)`
  margin-bottom: 24px;
`;

const RosterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PlayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const EncounterPortrait = styled.img`
  margin-bottom: 24px;
`;

const RosterTable: React.FC<IProps> = ({ raidId }) => {
  const [signups, setSignups] = useState<Signup[]>();
  const [roster, setRoster] = useState<Roster>();
  const [encounters, setEncounters] = useState<Encounter[]>();

  const [hasOnlyOneEncounter, setHasOnlyOneEncounter] = useState<boolean>();
  const [loneEncounter, setLoneEncounter] = useState<Encounter>();

  const {
    data,
    isLoading,
  }: {
    data: { signups: Signup[]; encounters: Encounter[] };
    isLoading: boolean;
  } = useQuery(
    ["raidData", raidId],
    () =>
      axios.get(`/api/wowaudit-proxy?raid=${raidId}`).then((res) => res.data),
    {
      enabled: !!raidId,
      retry: false,
    }
  );

  useEffect(() => {
    if (data) {
      setSignups(data.signups);
      setEncounters(data.encounters);
    }
  }, [data]);

  useEffect(() => {
    if (signups && encounters) {
      const { hasOnlyOne, encounter } = hasOnlyOneEnabledEncounter(
        data.encounters
      );

      setHasOnlyOneEncounter(hasOnlyOne);
      setLoneEncounter(encounter);

      if (hasOnlyOne) {
        setRoster(getRosterFromEncounter(signups, encounter));
      } else {
        setRoster(getRosterFromSignups(signups));
      }
    }
  }, [signups, encounters]);

  return (
    <Root id="roster-table">
      {isLoading && <p>IS LOADING</p>}

      {roster && (
        <>
          {hasOnlyOneEncounter ? (
            <EncounterWrapper>
              <EncounterPortrait
                src={`/bosses/${replaceWhitespaceWithUnderscore(
                  loneEncounter.name
                ).toLowerCase()}_landscape.png`}
                alt={loneEncounter.name}
                height={90}
              />
              <RosterWrapper>
                <Column>
                  <PlayerWrapper>
                    {map(roster.tank, (player) => (
                      <Player
                        key={player.character.name}
                        player={player.character}
                      />
                    ))}
                  </PlayerWrapper>
                  <PlayerWrapper>
                    {map(roster.heal, (player) => (
                      <Player
                        key={player.character.name}
                        player={player.character}
                      />
                    ))}
                  </PlayerWrapper>
                </Column>

                <PlayerWrapper>
                  {map(roster.melee, (player) => (
                    <Player
                      key={player.character.name}
                      player={player.character}
                    />
                  ))}
                </PlayerWrapper>

                <PlayerWrapper>
                  {map(roster.ranged, (player) => (
                    <Player
                      key={player.character.name}
                      player={player.character}
                    />
                  ))}
                </PlayerWrapper>

                <PlayerWrapper>
                  {map(getAllAbsentSignups(signups), (player) => (
                    <Player
                      key={player.character.name}
                      player={player.character}
                      status="absent"
                    />
                  ))}
                  {map(
                    getAllNonSelectedForEncounter(
                      loneEncounter.selections,
                      signups
                    ),
                    (player) => (
                      <Player
                        key={player.name}
                        player={player}
                        status="benched"
                      />
                    )
                  )}
                </PlayerWrapper>
              </RosterWrapper>
            </EncounterWrapper>
          ) : (
            <>
              <EncountersWrapper>
                {encounters.map(
                  (encounter) =>
                    encounter.enabled && (
                      <img
                        key={encounter.id}
                        src={`/bosses/${replaceWhitespaceWithUnderscore(
                          encounter.name
                        ).toLowerCase()}.png`}
                        alt={encounter.name}
                        width={68}
                        height={90}
                      />
                    )
                )}
                <img src={`/vault.png`} alt={`vault`} width={68} height={90} />
              </EncountersWrapper>

              {roster &&
                map(Object.entries(roster), ([group, players]) => (
                  <StyledPlayerGroup
                    key={group}
                    players={players}
                    encounters={encounters}
                  />
                ))}
            </>
          )}
        </>
      )}
    </Root>
  );
};

export default RosterTable;
