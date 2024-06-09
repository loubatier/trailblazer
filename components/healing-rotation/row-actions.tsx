import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  GripVertical,
  Lock,
  LucideIcon,
  Settings,
  TimerReset,
  Unlock,
  X,
} from "lucide-react";
import styled from "styled-components";
import { ETimelineRowType } from "../../data/models/timeline";
import { useBossRowStore } from "../../lib/stores/useBossRowStore";
import { useTimelineStore } from "../../lib/stores/useTimelineStore";
import { BossTimelineRow, RosterTimelineRow } from "./canvas";

interface IProps {
  row: RosterTimelineRow | BossTimelineRow;
  onDragRowStart?: () => void;
  onDragRowEnd?: () => void;
}

const Root = styled.div`
  position: relative;
`;

const Button = styled.button<{ bgColor?: string; isRowActive?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${({ bgColor, isRowActive }) =>
    bgColor || (isRowActive ? "#151718" : "#ffffff")};
  cursor: pointer;

  svg {
    flex-shrink: 0;
  }
`;

const ActionsButton = styled(Button)<{ isBossRow: boolean }>`
  padding: ${({ isBossRow }) => (isBossRow ? "32px 12px" : "0 12px 8px")};
  background-color: transparent;
  box-sizing: content-box;
`;

const ActionsWrapper = styled.div<{ isBossRow: boolean; isOpen: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  top: ${({ isBossRow }) => (isBossRow ? "32px" : 0)};
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
  activeIcon?: LucideIcon;
  inactiveIcon?: LucideIcon;
  bgColor?: string;
  isRowActive?: boolean;
}

const RowActions = ({ row, onDragRowStart, onDragRowEnd }: IProps) => {
  const { rows, deleteTimelineRow, updateTimelineRowStatus } =
    useTimelineStore();

  const { updateBossRowStatus, resetBossRowTimers } = useBossRowStore();

  const isBossRow = row.type === ETimelineRowType.BOSS;
  const index = isBossRow ? null : rows.indexOf(row);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleActions = () => {
    setIsOpen(!isOpen);
  };

  const handleRowDragStart = () => {
    if (onDragRowStart) onDragRowStart();
  };

  const handleRowDragEnd = () => {
    if (onDragRowEnd) onDragRowEnd();
  };

  const actions: Action[] = isBossRow
    ? [
        {
          icon: row.isLocked ? Lock : Unlock,
          onClick: () => updateBossRowStatus(!row.isLocked),
          condition: row.isLocked,
          activeIcon: Lock,
          inactiveIcon: Unlock,
          isRowActive: row.isLocked,
        },
        {
          icon: TimerReset,
          onClick: () => resetBossRowTimers(),
          bgColor: "#ff3535",
        },
      ]
    : [
        {
          icon: row.isActive ? EyeOff : Eye,
          onClick: () => updateTimelineRowStatus(index, !row.isActive),
          condition: row.isActive,
          activeIcon: EyeOff,
          inactiveIcon: Eye,
          isRowActive: row.isActive,
        },
        {
          icon: X,
          onClick: () => deleteTimelineRow(index),
          bgColor: "#ff3535",
        },
      ];

  return (
    <Root>
      <ActionsButton
        isBossRow={isBossRow}
        draggable={!isBossRow}
        onDragStart={handleRowDragStart}
        onDragOver={(e) => e.preventDefault()}
        onDragEnd={handleRowDragEnd}
        onClick={toggleActions}
      >
        {isBossRow ? (
          <Settings color={"white"} />
        ) : (
          <GripVertical color={"white"} />
        )}
      </ActionsButton>

      {isOpen && (
        <ActionsWrapper isBossRow={isBossRow} isOpen={isOpen}>
          {actions.map((action, i) => (
            <Button
              key={`row-actions-${i}`}
              onClick={action.onClick}
              bgColor={action.bgColor}
              isRowActive={action.isRowActive}
            >
              {action.condition !== undefined ? (
                action.condition ? (
                  <action.activeIcon color={"white"} />
                ) : (
                  <action.inactiveIcon color={"black"} />
                )
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

export default RowActions;
