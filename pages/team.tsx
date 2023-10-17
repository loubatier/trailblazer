import Link from "next/link";
import {
  Container,
  Main,
  Title,
  Description,
} from "../components/sharedstyles";
import Counter from "../components/counter";
import useStore from "../lib/stores/useStore";
import { useCounterStore } from "../lib/stores";

const About: React.FC = () => {
  const counterState = useStore(useCounterStore, (state) => state);
  return (
    <Container>
      <Main>
        <Title>Team Page</Title>
        <Description>
          <Link href="/">&larr; Go Back</Link>
        </Description>
        <div>COUNT: {counterState?.count}</div>
        <Counter label="TEAM" />
      </Main>
    </Container>
  );
};

export default About;
