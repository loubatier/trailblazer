import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTimelineStore } from "../lib/stores/useTimelineStore";
import Canvas from "./canvas";
import { ListPlus } from "lucide-react";
import RowActions from "./row-actions";
import Zoom from "./zoom";
import { Roster } from "../models/player";

interface IProps {}

const Root = styled.div`
  flex: 1 0 500px;
  padding: 0 48px;
`;

const TimelineWrapper = styled.div`
  display: flex;
`;

const RowActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: fit-content;
  margin-top: 48px;
`;

const CanvasWrapper = styled.div``;

const TimelineActionsWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const SpellsWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const SpellIcon = styled.img`
  border: 1px solid white;
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

const AddRowButton = styled.button<{ isDisabled: boolean }>`
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

const OldTimeline: React.FC<IProps> = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const { rows, addTimelineRow, addTimelineSpell, updateTimelineRowPosition } =
    useTimelineStore((state) => state);

  const [roster, setRoster] = useState<Roster>({ players: [] });
  const [spells, setSpells] = useState<any>([]);

  const [isDraggingSpell, setIsDraggingSpell] = useState<boolean>(false);
  const [hoveredRow, setHoveredRow] = useState<number>(null);

  const [isDraggingRow, setIsDraggingRow] = useState<boolean>(false);
  const [ghostRowY, setGhostRowY] = useState<number>(null);
  const [initialRowIndex, setInitialRowIndex] = useState<number>(null);
  const [destinationRowIndex, setDestinationRowIndex] = useState<number>(null);

  useEffect(() => {
    async function fetchRosterAndSpells() {
      try {
        const roster = await fetch("/roster.json");
        const spells = await fetch("/spells.json");
        const rosterJson = await roster.json();
        const spellsJson = await spells.json();

        setRoster(rosterJson);
        setSpells(spellsJson);
      } catch (error) {
        console.error("Error fetching the JSON data:", error);
      }
    }

    fetchRosterAndSpells();
  }, []);

  const getSpellsForPlayer = (player: any, spells: any): any[] => {
    return spells[player.spec] || [];
  };

  const renderSpellIcon = (spell: any): JSX.Element => {
    return (
      <SpellIcon
        draggable
        onDragStart={(e) => handleSpellDragStart(e, spell)}
        onDragEnd={() => handleSpellDragEnd()}
        key={spell.icon}
        src={spell.icon}
      />
    );
  };

  const spellIcons = roster.players
    .map((player) => getSpellsForPlayer(player, spells))
    .reduce((acc, playerSpells) => acc.concat(playerSpells), [])
    .map((spell) => renderSpellIcon(spell));

  // --------------------------- DRAG SPELL
  const calculateDestinationRowIndex = (y: number) => {
    const yPosWithoutHeader = y - 40;
    const initialDestinationRowIndex = Math.floor(yPosWithoutHeader / 40);
    return Math.floor(
      (yPosWithoutHeader - (initialDestinationRowIndex + 1) * 8) / 40
    );
  };

  const handleSpellDragStart = (event: React.DragEvent, spell: any) => {
    event.dataTransfer.setData("spell", JSON.stringify(spell));
    setIsDraggingSpell(true);
  };

  const handleSpellDragEnd = () => {
    setHoveredRow(null);
  };

  const handleCanvasDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    const y = event.clientY - canvasRef.current.getBoundingClientRect().top;

    setHoveredRow(calculateDestinationRowIndex(y));
  };

  const handleCanvasDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const spell = JSON.parse(event.dataTransfer.getData("spell"));
    const x = event.clientX - canvasRef.current.getBoundingClientRect().left;

    if (
      hoveredRow >= 0 &&
      hoveredRow <= rows.length - 1 &&
      rows[hoveredRow].isActive
    ) {
      addTimelineSpell(spell, hoveredRow, x - 12);
    }

    setHoveredRow(null);
    setIsDraggingSpell(false);
  };
  // ---------------------------

  // --------------------------- DRAG ROW
  const handleRowActionsDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    const y = event.clientY - canvasRef.current.getBoundingClientRect().top;

    setGhostRowY(y);
    setDestinationRowIndex(Math.floor((ghostRowY - 40) / 40));
  };

  const handleRowActionsDrop = (event: React.DragEvent) => {
    event.preventDefault();

    if (destinationRowIndex >= 0 && destinationRowIndex <= rows.length) {
      updateTimelineRowPosition(initialRowIndex, destinationRowIndex);
    }

    setGhostRowY(null);
    setIsDraggingRow(false);
  };
  // ---------------------------

  useEffect(() => {
    console.log({ destinationRowIndex });
  }, [destinationRowIndex]);

  return (
    <Root>
      <TimelineActionsWrapper>
        <AddRowButton isDisabled={false} onClick={() => addTimelineRow()}>
          <ListPlus />
        </AddRowButton>
        <Zoom />
        <SpellsWrapper>{spellIcons}</SpellsWrapper>
      </TimelineActionsWrapper>

      <TimelineWrapper>
        <RowActionsWrapper
          onDragOver={isDraggingRow ? handleRowActionsDragOver : null}
          onDrop={isDraggingRow ? handleRowActionsDrop : null}
        >
          {rows.map((_, i) => (
            <RowActions
              key={`row-actions-${i}`}
              rowIndex={i}
              onDragRowStart={() => {
                setInitialRowIndex(i);
                setIsDraggingRow(true);
              }}
              onDragRowEnd={() => {
                setInitialRowIndex(null);
                setIsDraggingRow(false);
              }}
            />
          ))}
        </RowActionsWrapper>
        <CanvasWrapper
          ref={canvasRef}
          onDragOver={isDraggingSpell ? handleCanvasDragOver : null}
          onDrop={isDraggingSpell ? handleCanvasDrop : null}
        >
          <Canvas
            width={1280}
            height={740}
            hoveredRow={hoveredRow}
            isDraggingRow={isDraggingRow}
            destinationRowIndex={destinationRowIndex}
            ghostRowY={ghostRowY}
          />
        </CanvasWrapper>
      </TimelineWrapper>
    </Root>
  );
};

export default OldTimeline;
