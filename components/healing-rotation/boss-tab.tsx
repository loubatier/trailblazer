import React from "react";
import styled from "styled-components";
import { Boss } from "../../lib/types/planner/timeline";

interface IProps {
  boss: Boss;
  isCurrentTab: boolean;
  onClick: () => void;
}

const Root = styled.button<{ isCurrentTab: boolean }>`
  display: flex;
  align-items: center;
  width: 200px;
  padding: 8px;
  background-color: #23262b;
  font-size: 16px;
  opacity: ${({ isCurrentTab }) => (isCurrentTab ? 1 : 0.5)};
  cursor: pointer;
`;

const Icon = styled.img<{ isDisabled: boolean }>`
  width: 24px;
  height: 24px;
  filter: ${({ isDisabled }) => (isDisabled ? "grayscale(1)" : "none")};
`;

const Label = styled.p`
  margin-left: 8px;
`;

const BossTab = ({ boss, isCurrentTab, onClick }: IProps) => {
  const isDisabled =
    boss.slug === "ky-veza" ||
    boss.slug === "silken-court" ||
    boss.slug === "queen-ansurek";

  return (
    <Root isCurrentTab={isCurrentTab} onClick={onClick} disabled={isDisabled}>
      <Icon src={boss.icon} isDisabled={isDisabled} />
      <Label>{boss.name}</Label>
    </Root>
  );
};

export default BossTab;
