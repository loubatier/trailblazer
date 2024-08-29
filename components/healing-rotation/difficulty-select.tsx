import React from "react";
import styled from "styled-components";
import { useBossStore } from "../../lib/stores/planner/useBossStore";
import { Difficulty } from "../../lib/types/planner/timeline";

const Root = styled.div`
  position: relative;
  height: 40px;
  padding: 12px 24px;
  background-color: #23262b;
`;

const DifficultySelect = () => {
  const { difficulty, setDifficulty } = useBossStore();

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDifficulty = event.target.value as Difficulty;
    setDifficulty(selectedDifficulty);
  };

  return (
    <Root>
      <select value={difficulty} onChange={handleDifficultyChange}>
        {Object.values(Difficulty).map((diff) => (
          <option key={diff} value={diff}>
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </option>
        ))}
      </select>
    </Root>
  );
};

export default DifficultySelect;
