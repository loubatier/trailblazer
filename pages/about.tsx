import React from "react";
import Link from "next/link";
import { Description, Main, Title } from "../components/sharedstyles";

const About = () => {
  return (
    <Main>
      <Title>About Page</Title>
      <Description>
        <Link href="/">&larr; Go Back</Link>
      </Description>
    </Main>
  );
};

export default About;
