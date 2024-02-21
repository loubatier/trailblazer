import React from "react";
import { useCounterStore } from "../lib/stores";

interface IProps {
  label: string;
}

const Counter = ({ label }: IProps) => {
  const increase = useCounterStore((state) => state.increase);
  const decrease = useCounterStore((state) => state.decrease);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div>
      <button onClick={() => increase()}>Increase {label}</button>
      <button onClick={() => decrease()}>Decrease {label}</button>
      <button onClick={() => reset()}>Reset {label}</button>
    </div>
  );
};

export default Counter;
