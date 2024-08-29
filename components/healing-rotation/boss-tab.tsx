import React from "react";
import styled from "styled-components";
import { Boss } from "../../lib/types/planner/timeline";

interface IProps {
  boss: Boss;
  isCurrentTab: boolean;
  onClick: () => void;
}

const Root = styled.div<{ isCurrentTab: boolean }>`
  display: flex;
  align-items: center;
  width: 200px;
  padding: 8px;
  background-color: #23262b;
  opacity: ${({ isCurrentTab }) => (isCurrentTab ? 1 : 0.5)};
  cursor: pointer;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Label = styled.p`
  margin-left: 8px;
`;

const BossTab = ({ boss, isCurrentTab, onClick }: IProps) => {
  return (
    <Root isCurrentTab={isCurrentTab} onClick={onClick}>
      <Icon src={boss.icon} />
      <Label>{boss.name}</Label>
    </Root>
  );
};

export default BossTab;
