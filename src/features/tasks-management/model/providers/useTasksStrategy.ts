import { TasksStrategyContext } from "./TasksStrategyContext";
import { useContext } from "react";

export const useTasksStrategy = () => {
  const context = useContext(TasksStrategyContext);

  if (!context) {
    throw new Error(
      "useTasksStrategy must be used inside TasksStrategyProvider",
    );
  }

  return context;
};
