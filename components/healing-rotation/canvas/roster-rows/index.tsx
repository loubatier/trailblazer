import React, { useEffect } from "react";
import { useTimelineRosterRowStore } from "../../../../lib/stores/planner/useTimelineRosterRowsStore";
import { useTimelineStore } from "../../../../lib/stores/planner/useTimelineStore";
import CanvasRow from "./roster-row";

interface IProps {
  hoveredRow: number;
}

const CanvasRosterRows = ({ hoveredRow }: IProps) => {
  const { timeline, zoom } = useTimelineStore();

  const {
    timelineRosterRows,
    setTimelineId,
    fetchTimelineRosterRows,
    subscribeToRealtimeUpdates,
    unsubscribeFromRealtimeUpdates,
  } = useTimelineRosterRowStore();

  useEffect(() => {
    setTimelineId(timeline?.id);
    fetchTimelineRosterRows();
    subscribeToRealtimeUpdates();
    return () => {
      unsubscribeFromRealtimeUpdates();
    };
  }, [timeline]);

  return (
    <>
      {timelineRosterRows?.map((row, i) => (
        <CanvasRow
          key={`canvas-row-${i}`}
          position={row.position}
          width={timeline.timer * zoom}
          isActive={row.isActive}
          isHovered={i === hoveredRow}
        />
      ))}
    </>
  );
};

export default CanvasRosterRows;
