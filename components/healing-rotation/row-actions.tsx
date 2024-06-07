import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  GripVertical,
  Lock,
  Settings,
  Unlock,
  X,
} from "lucide-react";
import styled from "styled-components";
import { useTimelineStore } from "../../lib/stores/useTimelineStore";
import { BossTimelineRow, ETimelineRowType, RosterTimelineRow } from "./canvas";

interface IProps {
  row: RosterTimelineRow | BossTimelineRow;
  onDragRowStart?: () => void;
  onDragRowEnd?: () => void;
}

const Root = styled.div`
  position: relative;
`;

const ActionsButton = styled.button<{ isBossRow: boolean }>`
  width: 40px;
  height: 40px;
  padding: 0 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
  box-sizing: content-box;
  padding: ${({ isBossRow }) => (isBossRow ? "32px 12px" : "0 12px 8px")};

  svg {
    flex-shrink: 0;
  }
`;

const StatusButton = styled.button<{ isRowActive: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${({ isRowActive }) =>
    isRowActive ? "#151718" : "#ffffff"};
  cursor: pointer;

  svg {
    flex-shrink: 0;
  }
`;

const DeleteButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #ff3535;
  cursor: pointer;

  svg {
    flex-shrink: 0;
  }
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

const Checkbox = styled.input`
  display: none;
`;

const RowActions = ({ row, onDragRowStart, onDragRowEnd }: IProps) => {
  const {
    rows,
    deleteTimelineRow,
    updateTimelineRowStatus,
    updateBossTimelineRowStatus,
  } = useTimelineStore((state) => state);

  const isBossRow = row.type === ETimelineRowType.BOSS;
  const index = isBossRow ? null : rows.indexOf(row);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleActions = () => {
    setIsOpen(!isOpen);
  };

  const handleRowDragStart = () => {
    onDragRowStart();
  };

  const handleRowDragEnd = () => {
    onDragRowEnd();
  };

  return (
    <Root>
      <ActionsButton
        isBossRow={isBossRow}
        draggable={!isBossRow}
        onDragStart={() => handleRowDragStart()}
        onDragOver={(e) => e.preventDefault()}
        onDragEnd={() => handleRowDragEnd()}
        onClick={toggleActions}
      >
        {isBossRow ? (
          <Settings color={"white"} />
        ) : (
          <GripVertical color={"white"} />
        )}
      </ActionsButton>
      {isOpen &&
        (isBossRow ? (
          <ActionsWrapper isBossRow={isBossRow} isOpen={isOpen}>
            <DeleteButton
              onClick={() => updateBossTimelineRowStatus(!row.isLocked)}
            >
              {row.isLocked ? (
                <Lock color={"white"} />
              ) : (
                <Unlock color={"black"} />
              )}
            </DeleteButton>
          </ActionsWrapper>
        ) : (
          <ActionsWrapper isBossRow={isBossRow} isOpen={isOpen}>
            <StatusButton
              onClick={() => updateTimelineRowStatus(index, !row.isActive)}
              isRowActive={row.isActive}
            >
              <Checkbox type="checkbox" checked={row.isActive} readOnly />
              {row.isActive ? (
                <EyeOff color={"white"} />
              ) : (
                <Eye color={"black"} />
              )}
            </StatusButton>
            <DeleteButton onClick={() => deleteTimelineRow(index)}>
              <X color={"white"} />
            </DeleteButton>
          </ActionsWrapper>
        ))}
    </Root>
  );
};

export default RowActions;
