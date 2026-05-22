import { useContext } from "react";
import { TasksStrategyContext } from "./TasksStrategyContext";

export const useTasksStrategy = () => {
  const context = useContext(TasksStrategyContext);

  if (!context) {
    throw new Error(
      "useTasksStrategy must be used inside TasksStrategyProvider",
    );
  }

  return context;
};
