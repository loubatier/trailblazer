import {
  MouseEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCounterStore } from "../lib/stores";
import styled from "styled-components";
import { useTimelineStore } from "../lib/stores/useTimelineStore";
import Canvas, { Spells } from "./canvas";
import { GripVertical, ListPlus } from "lucide-react";
import RowActions from "./row-actions";
import Zoom from "./zoom";
import { Roster } from "../models/player";

interface IProps {
  roster: Roster;
  spells: Spells;
}

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
  const { rows, addTimelineRow, addTimelineSpell } = useTimelineStore(
    (state) => state
  );
  const [roster, setRoster] = useState<Roster>({ players: [] });
  const [spells, setSpells] = useState<any>([]);
  const [hoveredRow, setHoveredRow] = useState<number>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

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
        onDragStart={(e) => handleSpellIconDragStart(e, spell)}
        onDragEnd={() => handleSpellIconDragEnd()}
        key={spell.icon}
        src={spell.icon}
        onClick={() => console.log(spell.duration)}
      />
    );
  };

  const spellIcons = roster.players
    .map((player) => getSpellsForPlayer(player, spells))
    .reduce((acc, playerSpells) => acc.concat(playerSpells), [])
    .map((spell) => renderSpellIcon(spell));

  const handleSpellIconDragStart = (event: React.DragEvent, spell: any) => {
    event.dataTransfer.setData("spell", JSON.stringify(spell));
  };

  const handleSpellIconDragEnd = () => {
    setHoveredRow(null);
  };

  const calculateDestinationRow = (y: number) => {
    const yPosWithoutHeader = y - 40;
    const initialDestinationRow = Math.floor(yPosWithoutHeader / 40);
    return Math.floor(
      (yPosWithoutHeader - (initialDestinationRow + 1) * 8) / 40
    );
  };

  const handleCanvasDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    const y = event.clientY - canvasRef.current.getBoundingClientRect().top;
    setHoveredRow(calculateDestinationRow(y));
  };

  const handleCanvasDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const spell = JSON.parse(event.dataTransfer.getData("spell"));
    const x = event.clientX - canvasRef.current.getBoundingClientRect().left;

    if (
      hoveredRow <= rows.length - 1 &&
      hoveredRow >= 0 &&
      rows[hoveredRow].isActive
    ) {
      addTimelineSpell(spell, hoveredRow, x - 12);
      setHoveredRow(null);
    }
  };

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
        <RowActionsWrapper>
          {rows.map((_, i) => (
            <RowActions key={`row-actions-${i}`} rowIndex={i} />
          ))}
        </RowActionsWrapper>
        <CanvasWrapper
          ref={canvasRef}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
        >
          <Canvas width={1280} height={740} hoveredRow={hoveredRow} />
        </CanvasWrapper>
      </TimelineWrapper>
    </Root>
  );
};

export default OldTimeline;
