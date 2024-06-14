import React from "react";
import dynamic from "next/dynamic";
import { Main } from "../components/sharedstyles";
import withAuth from "./api/auth/withAuth";

const HealingRotation = dynamic(
  () => import("../components/healing-rotation"),
  {
    ssr: false,
  }
);

const Planner = () => {
  return (
    <Main>
      <HealingRotation />
    </Main>
  );
};

export default withAuth(Planner);
