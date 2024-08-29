import React, { useState } from "react";
import { Eye, EyeOff, GripVertical, LucideIcon, X } from "lucide-react";
import styled from "styled-components";
import { useTimelineRosterRowStore } from "../../lib/stores/planner/useTimelineRosterRowsStore";
import { TimelineRosterRow } from "../../lib/types/planner/timeline";

interface IProps {
  row: TimelineRosterRow;
  onDragRowStart?: () => void;
  onDragRowOver?: (e: React.DragEvent) => void;
  onDragRowEnd?: (e: React.DragEvent) => void;
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

const ActionsButton = styled(Button)`
  padding: 0 12px 8px;
  background-color: transparent;
  box-sizing: content-box;
`;

const ActionsWrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  top: 0;
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

const RosterRowActions = ({
  row,
  onDragRowStart,
  onDragRowOver,
  onDragRowEnd,
}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleActions = () => {
    setIsOpen(!isOpen);
  };

  const handleRowDragStart = () => {
    if (onDragRowStart) {
      setIsOpen(false);
      onDragRowStart();
    }
  };

  const handleRowDragOver = (e) => {
    if (onDragRowOver) onDragRowOver(e);
  };

  const handleRowDragEnd = (e) => {
    if (onDragRowEnd) onDragRowEnd(e);
  };

  const { deleteRosterRow, updateRosterRowActiveState } =
    useTimelineRosterRowStore();

  const actions: Action[] = [
    {
      icon: row.isActive ? EyeOff : Eye,
      onClick: () => {
        updateRosterRowActiveState(row.id, !row.isActive);
        setIsOpen(false);
      },
      condition: row.isActive,
      activeIcon: EyeOff,
      inactiveIcon: Eye,
      isRowActive: row.isActive,
    },
    {
      icon: X,
      onClick: () => {
        deleteRosterRow(row.id, row.position);
        setIsOpen(false);
      },
      bgColor: "#ff3535",
    },
  ];

  return (
    <Root>
      <ActionsButton
        draggable
        onDragStart={handleRowDragStart}
        onDragOver={handleRowDragOver}
        onDragEnd={handleRowDragEnd}
        onClick={toggleActions}
      >
        <GripVertical color={"white"} />
      </ActionsButton>

      {isOpen && (
        <ActionsWrapper isOpen={isOpen}>
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

export default RosterRowActions;
