import React, { useState } from "react";
import { Lock, LucideIcon, Settings, TimerReset, Unlock } from "lucide-react";
import styled from "styled-components";
import { useBossStore } from "../../lib/stores/planner/useBossStore";
import { useTimelineBossSpellsStore } from "../../lib/stores/planner/useTimelineBossSpellsStore";

const Root = styled.div`
  position: relative;
`;

const Button = styled.button<{ bgColor?: string; isLocked?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${({ bgColor, isLocked }) =>
    bgColor || (isLocked ? "#ffffff" : "#151718")};
  cursor: pointer;

  svg {
    flex-shrink: 0;
  }
`;

const ActionsButton = styled(Button)`
  padding: 32px 12px;
  background-color: transparent;
  box-sizing: content-box;
`;

const ActionsWrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  top: 32px;
  right: 0;
  width: 88px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.application_background};
  transform: translateX(100%);
  z-index: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

interface Action {
  icon: LucideIcon;
  onClick: () => void;
  condition?: boolean;
  bgColor?: string;
  isRowActive?: boolean;
}

const BossRowActions = () => {
  const { currentBoss } = useBossStore();
  const { isLocked, setIsLocked, resetBossSpells } =
    useTimelineBossSpellsStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleActions = () => {
    setIsOpen(!isOpen);
  };

  const actions: Action[] = [
    {
      icon: isLocked ? Unlock : Lock,
      onClick: () => {
        setIsLocked(!isLocked);
        setIsOpen(false);
      },
      condition: isLocked,
      isRowActive: isLocked,
    },
    {
      icon: TimerReset,
      onClick: () => {
        resetBossSpells(currentBoss.slug, "amirdrassil");
        setIsOpen(false);
      },
      bgColor: "#ff3535",
    },
  ];

  return (
    <Root>
      <ActionsButton onClick={toggleActions}>
        <Settings color={"white"} />
      </ActionsButton>

      {isOpen && (
        <ActionsWrapper isOpen={isOpen}>
          {actions.map((action, i) => (
            <Button
              key={`row-actions-${i}`}
              onClick={action.onClick}
              bgColor={action.bgColor}
              isLocked={isLocked}
            >
              {action.condition !== undefined ? (
                <action.icon color={isLocked ? "black" : "white"} />
              ) : (
                <action.icon color={"white"} />
              )}
            </Button>
          ))}
        </ActionsWrapper>
      )}
    </Root>
  );
};

export default BossRowActions;
