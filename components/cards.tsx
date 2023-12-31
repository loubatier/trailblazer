import styled from "styled-components";
import Link from "next/link";

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin-top: 3rem;
  margin-bottom: 3rem;
`;

const Card = styled.div`
  display: flex;
  padding: 1.5rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid black;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
  margin: 0 1rem 0 0;

  &:hover,
  :focus,
  :active {
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const StyledA = styled.a`
  font-size: 1.5rem;
`;

interface LinkProps {
  href: string;
  name: string;
}

const StyledLink: React.FC<LinkProps> = ({ href, name }) => (
  <Link href={href} passHref legacyBehavior>
    <StyledA>{name}</StyledA>
  </Link>
);

const Cards: React.FC = () => {
  return (
    <FlexContainer>
      <Card>
        <StyledLink href="/about" name="About Page &rarr;" />
      </Card>
      <Card>
        <StyledLink href="/team" name="Team Page &rarr;" />
      </Card>
      <Card>
        <StyledLink href="/planner" name="Planner Page &rarr;" />
      </Card>
    </FlexContainer>
  );
};

export default Cards;
