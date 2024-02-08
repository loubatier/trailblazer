import React from "react";
import Link from "next/link";
import Counter from "../components/counter";
import {
  Container,
  Description,
  Main,
  Title,
} from "../components/sharedstyles";
import { useCounterStore } from "../lib/stores";
import useStore from "../lib/stores/useStore";

const About: React.FC = () => {
  const counterState = useStore(useCounterStore, (state) => state);

  return (
    <Container>
      <Main>
        <Title>About Page</Title>
        <Description>
          <Link href="/">&larr; Go Back</Link>
        </Description>
        <div>COUNT: {counterState?.count}</div>
        <Counter label="ABOUT" />
      </Main>
    </Container>
  );
};

export default About;
