import React from "react";
import { isMobile } from "react-device-detect";
import { Main } from "../components/sharedstyles";
import withAuth from "./api/auth/withAuth";

const Roster = () => {
  return <Main>{isMobile ? <>Go get a computer</> : <>Roster</>}</Main>;
};

export default withAuth(Roster);
