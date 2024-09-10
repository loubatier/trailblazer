import React, { useEffect } from "react";
import Konva from "konva";
import { useTimelineBossSpellsStore } from "../../../../lib/stores/planner/useTimelineBossSpellsStore";
import { useTimelineStore } from "../../../../lib/stores/planner/useTimelineStore";
import { TimelineBossSpell } from "../../../../lib/types/planner/timeline";
import CanvasBossSpell from "./spell";

const CanvasBossSpells = () => {
  const { timeline, zoom } = useTimelineStore();

  const {
    timelineBossSpells,
    isLocked,
    setTimelineId,
    setBossId,
    fetchTimelineBossSpells,
    fetchAllBossSpells,
    subscribeToRealtimeUpdates,
    unsubscribeFromRealtimeUpdates,
    updateBossSpellTiming,
    setBossSpellTiming,
  } = useTimelineBossSpellsStore();

  useEffect(() => {
    setTimelineId(timeline?.id);
    setBossId(timeline?.bossId);
    fetchTimelineBossSpells();
    fetchAllBossSpells();
    subscribeToRealtimeUpdates();
    return () => {
      unsubscribeFromRealtimeUpdates();
    };
  }, [timeline]);

  const handleDragMove = (
    e: Konva.KonvaEventObject<DragEvent>,
    id: TimelineBossSpell["id"]
  ) => {
    setBossSpellTiming(id, e.target.x() / zoom);
  };

  const handleDragEnd = (
    e: Konva.KonvaEventObject<DragEvent>,
    id: TimelineBossSpell["id"]
  ) => {
    updateBossSpellTiming(id, e.target.x() / zoom);
  };

  return (
    <>
      {timelineBossSpells?.map((spell, i) => (
        <CanvasBossSpell
          key={i}
          spell={spell}
          isLocked={isLocked}
          timer={timeline.timer}
          x={spell.timing * zoom}
          onClick={() => console.error("Click boss spell")}
          onDragMove={(e) => handleDragMove(e, spell.id)}
          onDragEnd={(e) => handleDragEnd(e, spell.id)}
        />
      ))}
    </>
  );
};

export default CanvasBossSpells;
