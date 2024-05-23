import React from "react";
import Link from "next/link";
import Counter from "../components/counter";
import { Description, Main, Title } from "../components/sharedstyles";
import { useCounterStore } from "../lib/stores";
import useStore from "../lib/stores/useStore";

const About = () => {
  const counterState = useStore(useCounterStore, (state) => state);

  return (
    <Main>
      <Title>About Page</Title>
      <Description>
        <Link href="/">&larr; Go Back</Link>
      </Description>
      <div>COUNT: {counterState?.count}</div>
      <Counter label="ABOUT" />
    </Main>
  );
};

export default About;
