import React from "react";
import dynamic from "next/dynamic";
import { isMobile } from "react-device-detect";
import { Main } from "../components/sharedstyles";
import withAuth from "./api/auth/withAuth";

const HealingRotation = dynamic(
  () => import("../components/healing-rotation"),
  {
    ssr: false,
  }
);

const Planner = () => {
  return <Main>{isMobile ? <>Go get a computer</> : <HealingRotation />}</Main>;
};

export default withAuth(Planner);
