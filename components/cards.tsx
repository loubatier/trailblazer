import React from "react";
import Link from "next/link";
import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  margin: 36px auto;
`;

const Card = styled.div`
  display: flex;
  color: black;
  text-decoration: none;
  border: 1px solid white;
  background-color: white;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
  margin: 0 1rem 0 0;

  &:hover,
  :focus,
  :active {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const StyledA = styled.a`
  font-size: 1.5rem;
  padding: 1.5rem;
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

const Cards = () => {
  return (
    <FlexContainer>
      <Card>
        <StyledLink href="/team" name="Roster Page &rarr;" />
      </Card>
      <Card>
        <StyledLink href="/planner" name="Planner Page &rarr;" />
      </Card>
    </FlexContainer>
  );
};

export default Cards;
