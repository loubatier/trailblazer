import React from "react";
import { useCounterStore } from "../lib/stores";

interface IProps {
  label: string;
}

const Counter: React.FC<IProps> = () => {
  const increase = useCounterStore((state) => state.increase);
  const decrease = useCounterStore((state) => state.decrease);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div>
      <button onClick={() => increase()}>Increase</button>
      <button onClick={() => decrease()}>Decrease</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  );
};

export default Counter;
