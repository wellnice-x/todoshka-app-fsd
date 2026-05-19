import { useEffect } from "react";

const useKeyboardFocus = () => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        document.documentElement.classList.add("keyboard-focus");
      }
    };

    const onMouseDown = () => {
      document.documentElement.classList.remove("keyboard-focus");
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);
};

export default useKeyboardFocus;
