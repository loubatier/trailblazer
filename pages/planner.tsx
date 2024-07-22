import React from "react";
import dynamic from "next/dynamic";
import { Main, Title } from "../components/sharedstyles";
import useRaidBosses from "../lib/hooks/useRaidBosses";
import useRosterSpells from "../lib/hooks/useRosterSpells";
import { useGuildMemberStore } from "../lib/stores/useGuildStore";
import withAuth from "./api/auth/withAuth";

const HealingRotation = dynamic(
  () => import("../components/healing-rotation"),
  {
    ssr: false,
  }
);

const Planner = () => {
  const { currentGuild } = useGuildMemberStore();

  const { rosterSpells } = useRosterSpells(
    "7f640200-4659-4431-9dc6-23c659dc8be0"
  ); // Santa maria ID

  const { raidBosses } = useRaidBosses("b3632f75-1dd8-40fb-bd0c-aaef44657dfc"); // ATDH ID

  return (
    <Main>
      {currentGuild && <Title>{currentGuild.name} Healing Rotation</Title>}
      <HealingRotation raidBosses={raidBosses} rosterSpells={rosterSpells} />
    </Main>
  );
};

export default withAuth(Planner);
