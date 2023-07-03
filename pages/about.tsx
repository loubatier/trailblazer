import Link from "next/link";
import {
  Container,
  Main,
  Title,
  Description,
} from "../components/sharedstyles";
import Counter from "../components/counter";

const About: React.FC = () => {
  return (
    <Container>
      <Main>
        <Title>About Page</Title>
        <Description>
          <Link href="/">&larr; Go Back</Link>
        </Description>
        <Counter label="ABOUT" />
      </Main>
    </Container>
  );
};

export default About;
