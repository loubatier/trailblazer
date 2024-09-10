import React, { useEffect } from "react";
import Konva from "konva";
import { calculateSpellDestinationRowIndex } from "../..";
import { useIsKeyPressed } from "../../../../lib/hooks/useIsKeyPressed";
import { useTimelineCharacterSpellStore } from "../../../../lib/stores/planner/useTimelineCharacterSpellsStore";
import { useTimelineRosterRowStore } from "../../../../lib/stores/planner/useTimelineRosterRowsStore";
import { useTimelineStore } from "../../../../lib/stores/planner/useTimelineStore";
import { TimelineCharacterSpell } from "../../../../lib/types/planner/timeline";
import CanvasSpell from "./spell";

interface IProps {
  hoveredRow: number;
  setHoveredRow: (index: number) => void;
}

const CanvasCharacterSpells = ({ hoveredRow, setHoveredRow }: IProps) => {
  const isShiftPressed = useIsKeyPressed("Shift");
  const { timeline, zoom } = useTimelineStore();

  const { timelineRosterRows } = useTimelineRosterRowStore();

  const {
    timelineCharacterSpells,
    setTimelineId,
    fetchTimelineCharacterSpells,
    fetchAllCharacterSpells,
    subscribeToRealtimeUpdates,
    unsubscribeFromRealtimeUpdates,
    updateCharacterSpellRow,
    updateCharacterSpellTiming,
    setCharacterSpellTiming,
    setCharacterSpellRow,
    setCharacterSpellSelection,
    clearCharacterSpellSelection,
    deleteCharacterSpell,
  } = useTimelineCharacterSpellStore();

  useEffect(() => {
    setTimelineId(timeline?.id);
    fetchTimelineCharacterSpells();
    fetchAllCharacterSpells();
    subscribeToRealtimeUpdates();
    return () => {
      unsubscribeFromRealtimeUpdates();
    };
  }, [timeline]);

  const handleDragStart = (id: TimelineCharacterSpell["id"]) => {
    // NOTE: We set temporary spell row to null so even when you drop on original row the spell snap back into place
    setCharacterSpellRow(id, null);
  };

  const handleDragMove = (
    e: Konva.KonvaEventObject<DragEvent>,
    id: TimelineCharacterSpell["id"]
  ) => {
    setCharacterSpellTiming(id, e.target.x() / zoom);
    isShiftPressed &&
      setHoveredRow(calculateSpellDestinationRowIndex(e.target.y()));
  };

  const handleDragEnd = (
    e: Konva.KonvaEventObject<DragEvent>,
    id: TimelineCharacterSpell["id"]
  ) => {
    const newX = e.target.x();
    isShiftPressed
      ? updateCharacterSpellRow(
          id,
          timelineRosterRows[hoveredRow].id,
          newX / zoom
        )
      : updateCharacterSpellTiming(id, newX / zoom);
    isShiftPressed && setHoveredRow(null);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const i = timelineCharacterSpells.findIndex((spell) => spell.isSelected);

      const hasSelectedSpell = timelineCharacterSpells.some(
        (spell) => spell.isSelected
      );

      if (!hasSelectedSpell) return;
      switch (e.key) {
        case "Backspace":
          deleteCharacterSpell(timelineCharacterSpells[i].id);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [timelineCharacterSpells]);

  // --------------------------- Character spell selection
  const handleWindowClick = () => {
    const isAnySpellSelected = timelineCharacterSpells.some(
      (tsc) => tsc.isSelected
    );
    isAnySpellSelected && clearCharacterSpellSelection();
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [timelineCharacterSpells, clearCharacterSpellSelection]);
  // ---------------------------

  return (
    <>
      {timelineCharacterSpells?.map((spell, i) => (
        <CanvasSpell
          key={i}
          spell={spell}
          onClick={() => setCharacterSpellSelection(spell.id)}
          onDragStart={() => handleDragStart(spell.id)}
          onDragMove={(e) => handleDragMove(e, spell.id)}
          onDragEnd={(e) => handleDragEnd(e, spell.id)}
        />
      ))}
    </>
  );
};

export default CanvasCharacterSpells;
