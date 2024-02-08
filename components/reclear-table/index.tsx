import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ESignupStatus,
  Encounter,
  Roster,
  Signup,
} from "../../data/models/roster";
import styled from "styled-components";
import {
  getAllAbsentSignups,
  getAllNonSelectedForEncounter,
  getRosterKeyFromCharacterRole,
  hasOnlyOneEnabledEncounter,
  replaceWhitespaceWithUnderscore,
} from "../../lib/utils";
import PlayerGroup from "./player-group";
import { map, size } from "lodash";
import Player from "./player";

interface IProps {
  raid: string;
}

const EncountersWrapper = styled.div`
  display: flex;
  gap: 1px;
  margin-left: 201px;
  margin-bottom: 24px;
`;

const StyledPlayerGroup = styled(PlayerGroup)`
  margin-bottom: 24px;
`;

const SingleEncounterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const generateRosterFromSignups = (signups: Signup[]): Roster => {
  return signups
    .filter((signup) => signup.status === ESignupStatus.PRESENT)
    .reduce<Roster>(
      (acc, signup) => {
        acc[getRosterKeyFromCharacterRole(signup.role)].push(signup);
        return acc;
      },
      { tank: [], heal: [], melee: [], ranged: [] }
    );
};

const ReclearTable: React.FC<IProps> = ({ raid }) => {
  const [signups, setSignups] = useState<Signup[]>(null);
  const [roster, setRoster] = useState<Roster>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  const {
    data,
    isLoading,
  }: {
    data: { signups: Signup[]; encounters: Encounter[] };
    isLoading: boolean;
  } = useQuery(
    ["raidData", raid],
    () => axios.get(`/api/wowaudit-proxy?raid=${raid}`).then((res) => res.data),
    {
      enabled: !!raid,
      retry: false,
    }
  );

  useEffect(() => {
    if (data) {
      setSignups(data.signups);
      setRoster(generateRosterFromSignups(data.signups));
      setEncounters(data.encounters);
    }
  }, [data]);

  console.log(encounters);

  return (
    <div>
      {isLoading && <p>IS LOADING</p>}

      {roster && (
        <>
          {hasOnlyOneEnabledEncounter(encounters) ? (
            <>
              <SingleEncounterWrapper>
                <Column>
                  <div>
                    {map(roster.tank, (player) => (
                      <Player player={player.character} />
                    ))}
                  </div>
                  <div>
                    {map(getAllAbsentSignups(signups), (player) => (
                      <Player player={player.character} status="absent" />
                    ))}
                    {map(
                      getAllNonSelectedForEncounter(
                        encounters[7].selections,
                        signups
                      ),
                      (player) => (
                        <Player player={player} status="benched" />
                      )
                    )}
                  </div>
                </Column>
                <div>
                  {map(roster.heal, (player) => (
                    <Player player={player.character} />
                  ))}
                </div>
                <div>
                  {map(roster.melee, (player) => (
                    <Player player={player.character} />
                  ))}
                </div>
                <div>
                  {map(roster.ranged, (player) => (
                    <Player player={player.character} />
                  ))}
                </div>
              </SingleEncounterWrapper>
            </>
          ) : (
            <>
              <EncountersWrapper>
                {encounters.map(
                  (encounter) =>
                    encounter.enabled && (
                      <img
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

              <StyledPlayerGroup
                players={roster.tank}
                encounters={encounters}
              />
              <StyledPlayerGroup
                players={roster.heal}
                encounters={encounters}
              />
              <StyledPlayerGroup
                players={roster.melee}
                encounters={encounters}
              />
              <StyledPlayerGroup
                players={roster.ranged}
                encounters={encounters}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReclearTable;
