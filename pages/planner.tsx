import React from "react";
import dynamic from "next/dynamic";
import { isMobile } from "react-device-detect";
import { Main } from "../components/sharedstyles";
import useRaidBosses from "../lib/hooks/useRaidBosses";
import withAuth from "./api/auth/withAuth";

const HealingRotation = dynamic(
  () => import("../components/healing-rotation"),
  {
    ssr: false,
  }
);

const Planner = () => {
  const { raidBosses } = useRaidBosses("b3632f75-1dd8-40fb-bd0c-aaef44657dfc"); // ATDH ID

  return (
    <Main>
      {isMobile ? (
        <>Go get a computer</>
      ) : (
        <HealingRotation raidBosses={raidBosses} />
      )}
    </Main>
  );
};

export default withAuth(Planner);
