import React, { useState } from "react";
import { Eye, EyeOff, GripVertical, X } from "lucide-react";
import styled from "styled-components";
import { useTimelineStore } from "../../lib/stores/useTimelineStore";

interface IProps {
  rowIndex: number;
  onDragRowStart: () => void;
  onDragRowEnd: () => void;
}

const Root = styled.div`
  position: relative;
`;

const ActionsButton = styled.button`
  width: 40px;
  height: 48px;
  padding: 0 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  cursor: pointer;

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

const Checkbox = styled.input`
  display: none;
`;

const RowActions = ({ rowIndex, onDragRowStart, onDragRowEnd }: IProps) => {
  const { rows, deleteTimelineRow, updateTimelineRowStatus } = useTimelineStore(
    (state) => state
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isRowActive = rows[rowIndex].isActive;

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
        draggable
        onDragStart={() => handleRowDragStart()}
        onDragOver={(e) => e.preventDefault()}
        onDragEnd={() => handleRowDragEnd()}
        onClick={toggleActions}
      >
        <GripVertical color={"white"} />
      </ActionsButton>
      {isOpen && (
        <ActionsWrapper isOpen={isOpen}>
          <StatusButton
            onClick={() => updateTimelineRowStatus(rowIndex, !isRowActive)}
            isRowActive={isRowActive}
          >
            <Checkbox type="checkbox" checked={isRowActive} readOnly />
            {isRowActive ? <EyeOff color={"white"} /> : <Eye color={"black"} />}
          </StatusButton>
          <DeleteButton onClick={() => deleteTimelineRow(rowIndex)}>
            <X color={"white"} />
          </DeleteButton>
        </ActionsWrapper>
      )}
    </Root>
  );
};

export default RowActions;
