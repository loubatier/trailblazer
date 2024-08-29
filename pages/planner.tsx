import React from "react";
import dynamic from "next/dynamic";
import { Main } from "../components/sharedstyles";
import useRaidBosses from "../lib/hooks/useRaidBosses";
import { useBossStore } from "../lib/stores/planner/useBossStore";
import { useGuildStore } from "../lib/stores/useGuildStore";
import withAuth from "./api/auth/withAuth";

const HealingRotation = dynamic(
  () => import("../components/healing-rotation"),
  {
    ssr: false,
  }
);

const Planner = () => {
  const { currentGuild } = useGuildStore();

  const { raidBosses } = useRaidBosses("b3632f75-1dd8-40fb-bd0c-aaef44657dfc"); // ATDH ID
  const { boss, difficulty } = useBossStore();

  return (
    <Main>
      {currentGuild && boss && (
        <p>
          Guild: {currentGuild.name} {currentGuild.id}
          <br />
          Roster:
          <br />
          Boss: {boss.name} {boss.id}
          <br />
          Difficulty: {difficulty}
        </p>
      )}

      <HealingRotation raidBosses={raidBosses} />
    </Main>
  );
};

export default withAuth(Planner);
