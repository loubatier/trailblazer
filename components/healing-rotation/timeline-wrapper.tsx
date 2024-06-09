import React from "react";
import { useEffect, useRef, useState } from "react";
import { ListPlus } from "lucide-react";
import styled from "styled-components";
import { Player, Roster } from "../../data/models/player";
import { useTimelineStore } from "../../lib/stores/useTimelineStore";
import Canvas, { TimelineSpell } from "./canvas";
import RowActions from "./row-actions";

const Root = styled.div`
  flex: 1 0 500px;
  padding: 0 48px;
`;

const TimelineContentWrapper = styled.div`
  display: flex;
  overflow: hidden;
  margin-top: 24px;
`;

const RowActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin-top: 40px;
`;

const CanvasWrapper = styled.div`
  width: 100%;
`;

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

export const GRADUATED_TIMELINE_HEIGHT = 40;
export const BOSS_TIMELINE_ROW_HEIGHT = 32 + 40 + 32;
export const TIMELINE_ROW_HEIGHT = 40;
export const BASE_SPACING = 8;

// --------------------------- Move this to utils in a folder dedicated to planner functions
export const calculateDestinationRowIndex = (y: number) => {
  const yPosWithoutHeader =
    y - GRADUATED_TIMELINE_HEIGHT - BOSS_TIMELINE_ROW_HEIGHT;

  const destinationRowIndex = Math.ceil(
    yPosWithoutHeader / (TIMELINE_ROW_HEIGHT + BASE_SPACING)
  );

  return destinationRowIndex;
};

export const calculateSpellDestinationRowIndex = (y: number) => {
  // NOTE:
  // Both 32 is for spacing around boss row
  // 16 is to compensate for limit of Y drag
  // 4 is to make sure the switch between a destination row and another
  // is made at the middle of the 8px space between rows
  const yPosWithoutHeader =
    y -
    GRADUATED_TIMELINE_HEIGHT -
    BOSS_TIMELINE_ROW_HEIGHT +
    16 +
    BASE_SPACING / 2;

  const destinationRowIndex = Math.floor(
    yPosWithoutHeader / (TIMELINE_ROW_HEIGHT + BASE_SPACING)
  );

  return destinationRowIndex;
};
// ---------------------------

const TimelineWrapper = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rowActionsRef = useRef<HTMLDivElement>(null);

  const {
    offset,
    spells,
    bossRow,
    rows,
    clearTimelineSpellSelection,
    addTimelineRow,
    addTimelineSpell,
    updateTimelineRowPosition,
  } = useTimelineStore((state) => state);

  const [roster, setRoster] = useState<Roster>({ players: [] });
  const [rosterSpells, setRosterSpells] = useState([]);

  const [isDraggingSpell, setIsDraggingSpell] = useState<boolean>(false);
  const [hoveredRow, setHoveredRow] = useState<number>(null);

  const [isDraggingRow, setIsDraggingRow] = useState<boolean>(false);
  const [ghostRowY, setGhostRowY] = useState<number>(0);
  const [initialRowIndex, setInitialRowIndex] = useState<number>(0);
  const [destinationRowIndex, setDestinationRowIndex] = useState<number>(0);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    async function fetchRosterAndSpells() {
      try {
        const roster = await fetch("/roster.json");
        const spells = await fetch("/spells.json");
        const rosterJson = await roster.json();
        const spellsJson = await spells.json();

        setRoster(rosterJson);
        setRosterSpells(spellsJson);
      } catch (error) {
        console.error("Error fetching the JSON data:", error);
      }
    }

    fetchRosterAndSpells();
  }, []);

  // --------------------------- useRosterSpells / usePlayerSpells
  // Switch between the 2 given we have selected the Everyone or specific player option on dropdown
  const getSpellsForPlayer = (
    player: Player,
    spells: TimelineSpell[]
  ): TimelineSpell[] => {
    return spells[player.spec] || [];
  };

  const renderSpellIcon = (spell: TimelineSpell): JSX.Element => {
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
    .map((player) => getSpellsForPlayer(player, rosterSpells))
    .reduce((acc, playerSpells) => acc.concat(playerSpells), [])
    .map((spell) => renderSpellIcon(spell));
  // ---------------------------

  // --------------------------- useDragSpell
  const handleSpellDragStart = (
    event: React.DragEvent,
    spell: TimelineSpell
  ) => {
    event.dataTransfer.setData("spell", JSON.stringify(spell));
    setIsDraggingSpell(true);
  };

  const handleSpellDragEnd = () => {
    setHoveredRow(null);
  };

  const handleCanvasDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    const y = event.clientY - canvasRef.current.getBoundingClientRect().top;
    setHoveredRow(calculateSpellDestinationRowIndex(y));
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
      addTimelineSpell(spell, hoveredRow, x - 12 - offset);
    }

    setHoveredRow(null);
    setIsDraggingSpell(false);
  };
  // ---------------------------

  // --------------------------- useDragRow
  const handleRowActionsDragOver = (event: React.DragEvent) => {
    const y =
      event.clientY -
      GRADUATED_TIMELINE_HEIGHT -
      canvasRef.current.getBoundingClientRect().top;

    setGhostRowY(y);
    setDestinationRowIndex(calculateDestinationRowIndex(y));
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

  const handleWindowClick = () => {
    const isAnySpellSelected = spells.some((spell) => spell.isSelected);
    isAnySpellSelected && clearTimelineSpellSelection();
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [spells, clearTimelineSpellSelection]);

  const handleWindowResize = () => {
    setDimensions({
      width: window.innerWidth - 64 - 2 * 48,
      height:
        GRADUATED_TIMELINE_HEIGHT +
        BOSS_TIMELINE_ROW_HEIGHT +
        rows.length * 8 +
        rows.length * 40,
    });
  };

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    handleWindowResize();
  }, [rows]);

  return (
    <Root>
      <TimelineActionsWrapper>
        <AddRowButton isDisabled={false} onClick={() => addTimelineRow()}>
          <ListPlus />
        </AddRowButton>
        <SpellsWrapper>{spellIcons}</SpellsWrapper>
      </TimelineActionsWrapper>

      <TimelineContentWrapper>
        <RowActionsWrapper>
          <RowActions row={bossRow} />
          <div
            ref={rowActionsRef}
            onDragOver={isDraggingRow ? handleRowActionsDragOver : null}
            onDrop={isDraggingRow ? handleRowActionsDrop : null}
          >
            {rows.map((row, i) => (
              <RowActions
                key={`row-actions-${i}`}
                row={row}
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
          </div>
        </RowActionsWrapper>
        <CanvasWrapper
          ref={canvasRef}
          onDragOver={isDraggingSpell ? handleCanvasDragOver : null}
          onDrop={isDraggingSpell ? handleCanvasDrop : null}
          onClick={(e) => e.stopPropagation()}
        >
          <Canvas
            width={dimensions.width}
            height={dimensions.height}
            hoveredRow={hoveredRow}
            isDraggingRow={isDraggingRow}
            ghostRowY={ghostRowY}
            setHoveredRow={(i) => setHoveredRow(i)}
          />
        </CanvasWrapper>
      </TimelineContentWrapper>
    </Root>
  );
};

export default TimelineWrapper;
