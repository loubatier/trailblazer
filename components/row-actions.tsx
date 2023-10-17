import styled from "styled-components";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import {
  EMoveDirection,
  useTimelineStore,
} from "../lib/stores/useTimelineStore";

interface IProps {
  rowIndex: number;
}

const Root = styled.div`
  position: relative;
`;

const ActionsButton = styled.button`
  width: 40px;
  height: 40px;
  padding: 0 8px;
  box-sizing: initial;
  box-sizing: initial;
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

const MoveButton = styled.button<{ isDisabled: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #ffffff;
  cursor: pointer;
  opacity: ${({ isDisabled }) => (isDisabled ? "0.5" : "1")};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "all")};

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
  width: 168px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.background};
  transform: translateX(100%);
  z-index: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

const Checkbox = styled.input`
  display: none;
`;

const RowActions: React.FC<IProps> = ({ rowIndex }) => {
  const {
    rows,
    deleteTimelineRow,
    updateTimelineRowStatus,
    updateTimelineRowPosition,
  } = useTimelineStore((state) => state);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isRowActive = rows[rowIndex].isActive;
  const isFirstRow = rowIndex === 0;
  const isLastRow = rowIndex === rows.length - 1;

  const openActions = () => {
    setIsOpen(true);
  };

  const closeActions = () => {
    setIsOpen(false);
  };

  return (
    <Root>
      <ActionsButton onMouseEnter={openActions} onMouseLeave={closeActions}>
        <GripVertical color={"white"} />
      </ActionsButton>
      {isOpen && (
        <ActionsWrapper
          isOpen={true}
          onMouseEnter={openActions}
          onMouseLeave={closeActions}
        >
          <StatusButton
            onClick={() => updateTimelineRowStatus(rowIndex, !isRowActive)}
            isRowActive={isRowActive}
          >
            <Checkbox type="checkbox" checked={isRowActive} readOnly />
            {isRowActive ? <EyeOff color={"white"} /> : <Eye color={"black"} />}
          </StatusButton>
          <MoveButton
            onClick={() =>
              updateTimelineRowPosition(
                rowIndex,
                rows[rowIndex],
                EMoveDirection.DOWN
              )
            }
            isDisabled={isLastRow}
          >
            <ChevronDown color={"black"} />
          </MoveButton>
          <MoveButton
            onClick={() =>
              updateTimelineRowPosition(
                rowIndex,
                rows[rowIndex],
                EMoveDirection.UP
              )
            }
            isDisabled={isFirstRow}
          >
            <ChevronUp color={"black"} />
          </MoveButton>
          <DeleteButton onClick={() => deleteTimelineRow(rowIndex)}>
            <X color={"white"} />
          </DeleteButton>
        </ActionsWrapper>
      )}
    </Root>
  );
};

export default RowActions;
