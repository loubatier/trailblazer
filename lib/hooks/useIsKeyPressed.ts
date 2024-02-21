import { useEffect, useState } from "react";

export const useIsKeyPressed = (key: string): { isKeyPressed: boolean } => {
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

  return { isKeyPressed };
};
