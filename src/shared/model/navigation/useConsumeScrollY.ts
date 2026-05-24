import { useEffect } from "react";
import { useTasksNavigationStore } from "./tasksNavigationStore";

export const useConsumeScrollY = () => {
  const consumeScrollY = useTasksNavigationStore(
    (state) => state.consumeScrollY,
  );

  useEffect(() => {
    const scroll = consumeScrollY();

    if (scroll !== null) {
      window.scrollTo({
        top: scroll,
        behavior: "instant",
      });
    }
  }, [consumeScrollY]);
};
