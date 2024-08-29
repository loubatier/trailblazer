import { useState } from "react";

// Function to create a new timeline character spell
const createTimelineCharacterSpell = async (
  spellId: number,
  timelineId: string,
  rowId: string,
  x: number,
  timing: number
) => {
  const response = await fetch("/api/create-timeline-character-spell", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ spellId, timelineId, rowId, x, timing }),
  });

  if (!response.ok) {
    throw new Error("Failed to create timeline character spell");
  }

  return await response.json();
};

// Function to delete an existing timeline character spell
const deleteTimelineCharacterSpell = async (id: string) => {
  const response = await fetch(
    `/api/delete-timeline-character-spell?id=${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete timeline character spell");
  }
};

const updateTimelineCharacterSpell = async (
  id: string,
  newRowId?: string,
  newX?: number,
  newTiming?: number
) => {
  const response = await fetch("/api/update-timeline-character-spell", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, newRowId, newX, newTiming }),
  });

  if (!response.ok) {
    throw new Error("Failed to update timeline character spell");
  }
};

// Custom hook for managing timeline character spells
const useTimelineCharacterSpell = (timelineId: string) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Method to create a new spell
  const createSpell = async (
    spellId: number,
    rowId: string,
    x: number,
    timing: number
  ) => {
    setIsCreating(true);
    setError(null);

    try {
      await createTimelineCharacterSpell(spellId, timelineId, rowId, x, timing);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  // Method to delete a spell
  const deleteSpell = async (id: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteTimelineCharacterSpell(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Method to update both row and x/timing
  const updateSpellRowAndTiming = async (
    id: string,
    newRowId: string,
    newX: number,
    newTiming: number
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      await updateTimelineCharacterSpell(id, newRowId, newX, newTiming);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Method to update only x/timing
  const updateSpellTiming = async (
    id: string,
    newX: number,
    newTiming: number
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      await updateTimelineCharacterSpell(id, null, newX, newTiming);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    createSpell,
    deleteSpell,
    updateSpellRowAndTiming,
    updateSpellTiming,
    isCreating,
    isDeleting,
    isUpdating,
    error,
  };
};

export default useTimelineCharacterSpell;
