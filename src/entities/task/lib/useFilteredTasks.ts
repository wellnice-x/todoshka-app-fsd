import type { UITask } from "@/entities/task";
import { useMemo } from "react";
import { useFilter } from "@/shared/model/task-filter";

export const useFilteredTasks = (tasks: UITask[]) => {
  const { activeFilter, searchQuery } = useFilter();

  return useMemo(() => {
    let queryTasks = tasks;

    if (activeFilter === "active") {
      queryTasks = queryTasks.filter((task) => !task.isDone);
    }

    if (activeFilter === "completed") {
      queryTasks = queryTasks.filter((task) => task.isDone);
    }

    if (searchQuery.trim() !== "") {
      const cleanSearchQuery = searchQuery.toLowerCase().trim();

      queryTasks = tasks.filter((task) =>
        task.title.toLowerCase().trim().includes(cleanSearchQuery),
      );
    }

    return queryTasks;
  }, [tasks, activeFilter, searchQuery]);
};
