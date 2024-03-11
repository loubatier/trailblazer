import { useEffect, useState } from "react";

type PressableKeys = "Shift" | "Alt";

export const useIsKeyPressed = (key: PressableKeys): boolean => {
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        setIsKeyPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === key) {
        setIsKeyPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [key]);

  return isKeyPressed;
};
