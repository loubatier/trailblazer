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
  getRosterKeyFromCharacterRole,
  replaceWhitespaceWithUnderscore,
} from "../../lib/utils";
import PlayerGroup from "./player-group";

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
      setRoster(generateRosterFromSignups(data.signups));
      setEncounters(data.encounters);
    }
  }, [data]);

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
                    ).toLowerCase()}.png`}
                    alt={encounter.name}
                    width={68}
                    height={90}
                  />
                )
            )}
            <img src={`/vault.png`} alt={`vault`} width={68} height={90} />
          </EncountersWrapper>
          {roster && (
            <>
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
