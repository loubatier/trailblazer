import React from "react";
import dynamic from "next/dynamic";
import { Main, Title } from "../components/sharedstyles";
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
  return (
    <Main>
      <Title>{currentGuild.name} Healing Rotation</Title>
      <HealingRotation />
    </Main>
  );
};

export default withAuth(Planner);
