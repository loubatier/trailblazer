import React from "react";
import styled from "styled-components";

interface IProps {
  name: string;
  icon: string;
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

const Tab = ({ name, icon, isCurrentTab, onClick }: IProps) => {
  return (
    <Root isCurrentTab={isCurrentTab} onClick={onClick}>
      <Icon src={icon} />
      <Label>{name}</Label>
    </Root>
  );
};

export default Tab;
