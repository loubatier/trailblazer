import React, { useCallback } from "react";
import { useEffect, useRef, useState } from "react";
import { isUndefined, map } from "lodash";
import { ListPlus } from "lucide-react";
import styled from "styled-components";
import useRaidBosses from "../../lib/hooks/useRaidBosses";
import useRosterCharacters from "../../lib/hooks/useRosterCharacters";
import useRosterSpells from "../../lib/hooks/useRosterSpells";
import { useBossStore } from "../../lib/stores/planner/useBossStore";
import { useTimelineCharacterSpellStore } from "../../lib/stores/planner/useTimelineCharacterSpellsStore";
import { useTimelineRosterRowStore } from "../../lib/stores/planner/useTimelineRosterRowsStore";
import { useTimelineStore } from "../../lib/stores/planner/useTimelineStore";
import { Character, roleSpecMapping } from "../../lib/types/planner/roster";
import {
  RosterSpell,
  SpellFilter,
  TimelineRosterRow,
} from "../../lib/types/planner/timeline";
import BossRowActions from "./boss-row-actions";
import BossTab from "./boss-tab";
import TimelineCanvas from "./canvas";
import SpellFilterSelect from "./character-select";
import DifficultySelect from "./difficulty-select";
import EmptyTimeline from "./empty-timeline";
import RowActions from "./roster-row-actions";

const Root = styled.div`
  flex: 1 0 500px;
`;

const TimelineContentWrapper = styled.div`
  display: flex;
  min-height: 300px;
  overflow: hidden;
  padding: 32px 0 16px;
  background-color: #23262b;
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

const SpellIcon = styled.img`
  border: 1px solid white;
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

const TimelineBossWrapper = styled.div`
  overflow: scroll;
  padding-bottom: 20px;
  margin-bottom: -20px;
`;

const TimelineBossContainer = styled.div`
  display: flex;
  width: fit-content;
  gap: 4px;
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

const TimelineActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const SpellsWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const DifficultyBossWrapper = styled.div`
  display: flex;
  gap: 8px;
  overflow: hidden;
`;

export const GRADUATED_TIMELINE_HEIGHT = 40;
export const BOSS_TIMELINE_ROW_HEIGHT = 32 + 40 + 32;
export const TIMELINE_ROW_HEIGHT = 40;
export const BASE_SPACING = 8;

// --------------------------- Move this to utils in a folder dedicated to planner functions
export const calculateDestinationRowIndex = (y: number) => {
  const yPosWithoutHeader =
    y - GRADUATED_TIMELINE_HEIGHT - BOSS_TIMELINE_ROW_HEIGHT + BASE_SPACING / 8;

  const destinationRowIndex = Math.ceil(
    yPosWithoutHeader / (TIMELINE_ROW_HEIGHT + BASE_SPACING)
  );

  return destinationRowIndex;
};

export const calculateSpellDestinationRowIndex = (y: number) => {
  // NOTE:
  // Both 32 is for spacing around boss row
  // 4 is to make sure the switch between a destination row and another
  // is made at the middle of the 8px space between rows
  const yPosWithoutHeader =
    y - GRADUATED_TIMELINE_HEIGHT - BOSS_TIMELINE_ROW_HEIGHT + BASE_SPACING / 2;

  const destinationRowIndex = Math.floor(
    yPosWithoutHeader / (TIMELINE_ROW_HEIGHT + BASE_SPACING)
  );

  return Math.max(0, destinationRowIndex);
};
// ---------------------------

const HealingRotation = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const rosterId = "7f640200-4659-4431-9dc6-23c659dc8be0"; // Santa maria main roster ID

  const { data: raidBosses } = useRaidBosses(
    "042405a9-9226-4abf-9282-3e23e30afecf"
  ); // ATDH ID

  useEffect(() => {
    if (raidBosses) setBosses(raidBosses);
  }, [raidBosses]);

  const { bosses, currentBoss, difficulty, setBosses, setCurrentBoss } =
    useBossStore();
  const { timeline, isLoading, zoom, fetchTimeline, createTimeline } =
    useTimelineStore();
  const {
    timelineRosterRows,
    isLoading: isLoadingRosterRow,
    createRosterRow,
    updateRosterRowPosition,
  } = useTimelineRosterRowStore();
  const { createCharacterSpell } = useTimelineCharacterSpellStore();

  const handleFetchTimeline = useCallback(() => {
    if (currentBoss && difficulty) {
      fetchTimeline(rosterId, currentBoss.id, difficulty);
    }
  }, [currentBoss, difficulty, fetchTimeline]);

  useEffect(() => {
    handleFetchTimeline();
  }, [handleFetchTimeline]);

  useEffect(() => {
    if (!currentBoss) setCurrentBoss(bosses[0]);
  }, [bosses]);

  const [isDraggingSpell, setIsDraggingSpell] = useState<boolean>(false);
  const [hoveredRow, setHoveredRow] = useState<number>(null);

  const [isDraggingRow, setIsDraggingRow] = useState<boolean>(false);
  const [ghostRowY, setGhostRowY] = useState<number>(0);
  const [indicatorPosition, setIndicatorPosition] = useState<number>(0);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // --------------------------- Drag roster spell
  const handleSpellDragStart = (event: React.DragEvent, spell: RosterSpell) => {
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

    const spell: RosterSpell = JSON.parse(event.dataTransfer.getData("spell"));
    const x = event.clientX - canvasRef.current.getBoundingClientRect().left;

    if (
      hoveredRow >= 0 &&
      hoveredRow <= timelineRosterRows.length - 1 &&
      timelineRosterRows[hoveredRow].isActive
    ) {
      createCharacterSpell(spell, x / zoom, timelineRosterRows[hoveredRow].id);
    }

    setHoveredRow(null);
    setIsDraggingSpell(false);
  };
  // ---------------------------

  // --------------------------- Render roster spells

  const { rosterCharacters } = useRosterCharacters(
    "7f640200-4659-4431-9dc6-23c659dc8be0"
  );

  const { rosterSpells } = useRosterSpells(
    "7f640200-4659-4431-9dc6-23c659dc8be0"
  );

  const [displayedRosterSpells, setDisplayedRosterSpells] = useState<
    RosterSpell[]
  >([]);
  const [spellFilter, setSpellFilter] = useState<SpellFilter>("everyone");

  const handleSpellFilterChange = (value: string) => {
    setSpellFilter(value);
  };

  const filterRosterSpells = (
    characters: Character[],
    spells: RosterSpell[],
    spellFilter: SpellFilter
  ): RosterSpell[] => {
    if (spellFilter === "everyone") {
      // Return spells where character is null
      return spells.filter((spell) => spell.character.id === "unknown");
    }

    if (spellFilter in roleSpecMapping) {
      // Return spells where the spec_id of the character matches the role
      const validSpecIds = roleSpecMapping[spellFilter];
      return spells.filter((spell) =>
        characters.some(
          (char) =>
            char.id === spell.character.id && validSpecIds.includes(char.specId)
        )
      );
    }

    // If filter is a specific characterId
    return spells.filter((spell) => spell.character.id === spellFilter);
  };

  useEffect(() => {
    setDisplayedRosterSpells(
      filterRosterSpells(rosterCharacters, rosterSpells, spellFilter)
    );
  }, [spellFilter, rosterSpells]);

  const renderSpellIcon = (spell: RosterSpell): JSX.Element => {
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

  const spellIcons = map(displayedRosterSpells, (rs) => renderSpellIcon(rs));
  // ---------------------------

  // --------------------------- Drag roster row
  const handleRowDragOver = (event: React.DragEvent) => {
    event.preventDefault();

    const y =
      event.clientY -
      GRADUATED_TIMELINE_HEIGHT -
      canvasRef.current.getBoundingClientRect().top;

    setGhostRowY(y);
    setIndicatorPosition(calculateDestinationRowIndex(y));
  };

  const handleRowDrop = (event: React.DragEvent, row: TimelineRosterRow) => {
    event.preventDefault();

    if (
      indicatorPosition >= 0 &&
      indicatorPosition <= timelineRosterRows.length
    ) {
      // NOTE : The position of the indicator is the not the real new position we want for the row
      // Immediate spaces around the dragged row should be associated with the current row position
      const newPosition =
        indicatorPosition > row.position
          ? indicatorPosition - 1
          : indicatorPosition;
      updateRosterRowPosition(row.id, newPosition);
    }

    setGhostRowY(null);
    setIsDraggingRow(false);
  };
  // ---------------------------

  // --------------------------- Window resize
  const handleWindowResize = (rowAmount: number) => {
    setDimensions({
      // NOTE:
      // 64 is width of sidebar
      // 64 is width of row actions
      // 2*48 is for both gutter on the sides
      // 48 is to make sure canvas is smaller so we have a right space balancing row actions space
      width: window.innerWidth - 64 - 64 - 2 * 48 - 48,
      height:
        GRADUATED_TIMELINE_HEIGHT +
        BOSS_TIMELINE_ROW_HEIGHT +
        rowAmount * 8 +
        rowAmount * 40 +
        8,
    });
  };

  useEffect(() => {
    if (!timelineRosterRows || timelineRosterRows.length === 0) return;
    const handler = () => handleWindowResize(timelineRosterRows.length);
    window.addEventListener("resize", handler);
    handler();
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, [timelineRosterRows]);
  // ---------------------------

  return (
    <Root>
      <TimelineActionsWrapper>
        <AddRowButton
          isDisabled={isLoadingRosterRow || isUndefined(timeline)}
          onClick={createRosterRow}
        >
          <ListPlus color="black" />
        </AddRowButton>
        <SpellFilterSelect
          spellFilter={spellFilter}
          onSpellFilterChange={handleSpellFilterChange}
        />
        <SpellsWrapper>{spellIcons}</SpellsWrapper>
      </TimelineActionsWrapper>
      <DifficultyBossWrapper>
        <DifficultySelect />
        <TimelineBossWrapper>
          <TimelineBossContainer>
            {bosses?.map((rb, i) => (
              <BossTab
                key={`raidboss-${i}-${rb.name}`}
                boss={rb}
                isCurrentTab={rb.name === currentBoss?.name}
                onClick={() => setCurrentBoss(rb)}
              />
            ))}
          </TimelineBossContainer>
        </TimelineBossWrapper>
      </DifficultyBossWrapper>
      <TimelineContentWrapper>
        {isLoading ? (
          <>Is Loading ...</>
        ) : isUndefined(timeline) ? (
          <EmptyTimeline
            onClick={() =>
              createTimeline(
                rosterId,
                "nerubar-palace",
                currentBoss.id,
                currentBoss.slug,
                difficulty
              )
            }
          />
        ) : (
          <>
            <RowActionsWrapper>
              <BossRowActions />
              <div>
                {timelineRosterRows?.map((row, i) => (
                  <RowActions
                    key={`row-actions-${i}`}
                    row={row}
                    onDragRowStart={() => {
                      setIsDraggingRow(true);
                    }}
                    onDragRowOver={isDraggingRow ? handleRowDragOver : null}
                    onDragRowEnd={(e) => handleRowDrop(e, row)}
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
              {timeline && (
                <TimelineCanvas
                  width={dimensions.width}
                  height={dimensions.height}
                  isDraggingRow={isDraggingRow}
                  ghostRowY={ghostRowY}
                  hoveredRow={hoveredRow}
                  setHoveredRow={(i) => setHoveredRow(i)}
                />
              )}
            </CanvasWrapper>
          </>
        )}
      </TimelineContentWrapper>
    </Root>
  );
};

export default HealingRotation;
