import { useState } from "react";

const createTimelineRosterRow = async (timelineId: string) => {
  const response = await fetch("/api/create-timeline-roster-row", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timelineId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create timeline roster row");
  }

  return await response.json();
};

const deleteTimelineRosterRow = async (id: string) => {
  const response = await fetch(`/api/delete-timeline-roster-row?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete timeline roster row");
  }
};

const updateTimelineRosterRowPosition = async (
  id: string,
  newPosition: number
) => {
  const response = await fetch("/api/update-timeline-roster-row", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, newPosition }),
  });

  if (!response.ok) {
    throw new Error("Failed to update timeline roster row position");
  }
};

const updateTimelineRosterRowStatus = async (id: string, isActive: boolean) => {
  const response = await fetch("/api/update-timeline-roster-row", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, isActive }),
  });

  if (!response.ok) {
    throw new Error("Failed to update timeline roster row status");
  }
};

const useTimelineRosterRow = (timelineId: string) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdatingPosition, setIsUpdatingPosition] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createRow = async () => {
    setIsCreating(true);
    setError(null);

    try {
      await createTimelineRosterRow(timelineId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteRow = async (id: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteTimelineRosterRow(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const updateRowPosition = async (id: string, newPosition: number) => {
    setIsUpdatingPosition(true);
    setError(null);

    try {
      await updateTimelineRosterRowPosition(id, newPosition);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdatingPosition(false);
    }
  };

  const updateRowStatus = async (id: string, isActive: boolean) => {
    setIsUpdatingStatus(true);
    setError(null);

    try {
      await updateTimelineRosterRowStatus(id, isActive);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return {
    createRow,
    deleteRow,
    updateRowPosition,
    updateRowStatus,
    isCreating,
    isDeleting,
    isUpdatingPosition,
    isUpdatingStatus,
    error,
  };
};

export default useTimelineRosterRow;
