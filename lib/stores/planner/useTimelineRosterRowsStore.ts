import { create } from "zustand";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";
import { TimelineRosterRow } from "../../types/planner/timeline";

const createTimelineRosterRow = async (
  timelineId: string,
  position: number,
  isActive: boolean
) => {
  const response = await fetch("/api/timeline-roster-row/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timelineId, position, isActive }),
  });

  if (!response.ok) {
    throw new Error("Failed to create timeline roster row");
  }

  return await response.json();
};

const deleteTimelineRosterRow = async (id: string) => {
  const response = await fetch(`/api/timeline-roster-row/delete?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete timeline roster row");
  }
};

const updateTimelineRosterRow = async (
  id: string,
  newPosition?: number,
  newIsActive?: boolean
) => {
  const response = await fetch("/api/timeline-roster-row/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, newPosition, newIsActive }),
  });

  if (!response.ok) {
    throw new Error("Failed to update timeline roster row");
  }
};

type TimelineRosterRowStore = {
  timelineId: string;
  timelineRosterRows: TimelineRosterRow[];
  lastId: TimelineRosterRow["id"];
  realtimeChannel: RealtimeChannel;
  isLoading: boolean;
  setTimelineId: (timelineId: string) => void;
  fetchTimelineRosterRows: () => Promise<void>;
  subscribeToRealtimeUpdates: () => void;
  unsubscribeFromRealtimeUpdates: () => void;
  createRosterRow: () => Promise<void>;
  updateRosterRowPosition: (
    id: TimelineRosterRow["id"],
    newPosition: number
  ) => Promise<void>;
  updateRosterRowActiveState: (
    id: TimelineRosterRow["id"],
    isActive: boolean
  ) => Promise<void>;
  deleteRosterRow: (
    id: TimelineRosterRow["id"],
    position: TimelineRosterRow["position"]
  ) => Promise<void>;
};

export const useTimelineRosterRowStore = create<TimelineRosterRowStore>(
  (set, get) => ({
    timelineId: null,
    timelineRosterRows: [],
    lastId: null,
    realtimeChannel: null,
    isLoading: false,

    setTimelineId: (timelineId: string) => {
      set({ timelineId });
    },

    fetchTimelineRosterRows: async () => {
      const { timelineId } = get();
      if (!timelineId) {
        console.error("No timelineId set");
        return;
      }

      set({ isLoading: true });
      try {
        const response = await fetch(
          `/api/timeline-roster-row/fetch-all?timelineId=${timelineId}`
        );
        const data = await response.json();

        const timelineRosterRows: TimelineRosterRow[] = data.map((row) => ({
          id: row.id,
          timelineId: row.timeline_id,
          position: row.position,
          isActive: row.is_active,
        }));

        set({ timelineRosterRows });
      } catch (error) {
        console.error("Error fetching roster rows:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    subscribeToRealtimeUpdates: () => {
      const { timelineId } = get();
      if (!timelineId) {
        console.error("No timelineId set");
        return;
      }

      const channel = supabase
        .channel(`timeline_roster_rows`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "timeline_roster_rows",
            filter: `timeline_id=eq.${timelineId}`,
          },
          async (payload) => {
            const { eventType, new: newRow, old: oldRow } = payload;
            const currentRows = get().timelineRosterRows;

            if (eventType === "INSERT") {
              const existingSpell = currentRows.find(
                (spell) => spell.id === newRow.id
              );

              if (existingSpell) return;

              const newTransformedRow: TimelineRosterRow = {
                id: newRow.id,
                timelineId: newRow.timeline_id,
                position: newRow.position,
                isActive: newRow.is_active,
              };

              set((state) => ({
                timelineRosterRows: [
                  ...state.timelineRosterRows,
                  newTransformedRow,
                ],
              }));
            } else if (eventType === "UPDATE") {
              if (newRow.id === get().lastId) return;

              set((state) => {
                const updatedRows = state.timelineRosterRows.map((row) =>
                  row.id === newRow.id
                    ? {
                        ...row,
                        position: newRow.position,
                        isActive: newRow.is_active,
                      }
                    : row
                );

                updatedRows.sort((a, b) => a.position - b.position);

                return { timelineRosterRows: updatedRows };
              });
            } else if (eventType === "DELETE") {
              set((state) => ({
                timelineRosterRows: state.timelineRosterRows.filter(
                  (row) => row.id !== oldRow.id
                ),
              }));
            }
          }
        )
        .subscribe();

      set({ realtimeChannel: channel });
    },

    unsubscribeFromRealtimeUpdates: () => {
      const channel = get().realtimeChannel;
      if (channel) {
        supabase.removeChannel(channel);
        set({ realtimeChannel: null });
      }
    },

    createRosterRow: async () => {
      const { timelineId, timelineRosterRows } = get();
      if (!timelineId) {
        console.error("No timelineId set");
        return;
      }

      const maxPosition =
        timelineRosterRows.length > 0
          ? Math.max(...timelineRosterRows.map((row) => row.position))
          : -1;

      const newPosition = maxPosition + 1;

      const tempId = `temp-${Date.now()}`;
      const tempRow: TimelineRosterRow = {
        id: tempId,
        timelineId,
        position: newPosition,
        isActive: true,
      };

      set((state) => ({
        timelineRosterRows: [...(state.timelineRosterRows ?? []), tempRow],
      }));

      try {
        const data = await createTimelineRosterRow(
          timelineId,
          newPosition,
          true
        );

        set((state) => ({
          timelineRosterRows: state.timelineRosterRows.map((row) =>
            row.id === tempId ? { ...row, id: data.id } : row
          ),
        }));
      } catch (error) {
        console.error("Error creating timeline roster row:", error);
        set((state) => ({
          timelineRosterRows: state.timelineRosterRows.filter(
            (r) => r.id !== tempId
          ),
        }));
      }
    },

    updateRosterRowPosition: async (id, newPosition) => {
      const previousRows = get().timelineRosterRows;

      set((state) => {
        const rowToUpdate = state.timelineRosterRows.find(
          (row) => row.id === id
        );
        if (!rowToUpdate) {
          console.error("Row not found");
          return state;
        }

        const oldPosition = rowToUpdate.position;

        const updatedRows = state.timelineRosterRows.map((row) => {
          if (row.id === id) {
            return { ...row, position: newPosition };
          } else if (
            oldPosition < newPosition &&
            row.position > oldPosition &&
            row.position <= newPosition
          ) {
            return { ...row, position: row.position - 1 };
          } else if (
            oldPosition > newPosition &&
            row.position >= newPosition &&
            row.position < oldPosition
          ) {
            return { ...row, position: row.position + 1 };
          } else {
            return row;
          }
        });

        updatedRows.sort((a, b) => a.position - b.position);

        return { timelineRosterRows: updatedRows, lastId: id };
      });

      try {
        await updateTimelineRosterRow(id, newPosition, null);
      } catch (error) {
        console.error("Error updating roster row position:", error);
        set({ timelineRosterRows: previousRows, lastId: null });
      }
    },

    updateRosterRowActiveState: async (id, isActive) => {
      const previousRows = get().timelineRosterRows;

      set((state) => ({
        timelineRosterRows: state.timelineRosterRows.map((row) =>
          row.id === id ? { ...row, isActive } : row
        ),
        lastId: id,
      }));

      try {
        await updateTimelineRosterRow(id, null, isActive);
      } catch (error) {
        console.error("Error updating roster row active state:", error);
        set({ timelineRosterRows: previousRows, lastId: null });
      }
    },

    deleteRosterRow: async (id, position) => {
      const previousRows = get().timelineRosterRows;

      set((state) => ({
        timelineRosterRows: state.timelineRosterRows
          .filter((row) => row.id !== id)
          .map((row) => ({
            ...row,
            position: row.position > position ? row.position - 1 : row.position,
          })),
      }));

      try {
        await deleteTimelineRosterRow(id);
      } catch (error) {
        console.error("Error deleting roster row:", error);
        set({ timelineRosterRows: previousRows });
      }
    },
  })
);
