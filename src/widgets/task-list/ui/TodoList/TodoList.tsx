import type { Task, UITask } from "@/entities/task";
import { useTasksPageStore } from "@/pages/tasks";
import { AnimatePresence } from "motion/react";
import { useFilter } from "@/features/filter-tasks";
import { useEffect } from "react";
import MotionListItem from "@/features/task-animation";
import TodoItem from "@/widgets/task-item";
import styles from "./TodoList.module.scss";

export type ToggleTaskFn = (
  taskId: string,
  newIsDone: boolean,
) => Promise<Task | undefined>;

export type DeleteTaskFn = (taskId: string) => Promise<void>;

type TodoListProps = {
  className?: string;
  currentTasks: UITask[];
  isNoTasksAtAll: boolean;
  toggleTask: ToggleTaskFn;
  deleteTask: DeleteTaskFn;
  roundingPosition: "top" | "bottom" | "none";
};

const TodoList = (props: TodoListProps) => {
  const {
    className,
    toggleTask,
    deleteTask,
    currentTasks,
    roundingPosition,
    isNoTasksAtAll,
  } = props;

  const { searchQuery, activeFilter } = useFilter();

  const hasTasks = currentTasks.length > 0;

  const highlightedTaskId = useTasksPageStore(
    (state) => state.highlightedTaskId,
  );
  const consumeHighlight = useTasksPageStore((state) => state.consumeHighlight);

  useEffect(() => {
    if (highlightedTaskId) {
      consumeHighlight();
    }
  }, [highlightedTaskId, consumeHighlight]);

  return (
    <ul
      className={`
      ${styles.list} 
      ${
        roundingPosition === "top"
          ? styles.roundingTop
          : roundingPosition === "bottom"
            ? styles.roundingBottom
            : ""
      }
      ${className ?? ""}`}
      aria-label="Tasks list"
    >
      <AnimatePresence key={`${activeFilter}-${searchQuery}`}>
        {hasTasks &&
          currentTasks.map((task) => (
            <MotionListItem className={styles.item} key={task.__uiKey}>
              <TodoItem
                task={task}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                isHighlighted={task.id === highlightedTaskId}
              />
            </MotionListItem>
          ))}
      </AnimatePresence>
      {!hasTasks && (
        <li
          key="noTasksStub"
          className={`
            ${styles.infoStub} 
            ${isNoTasksAtAll ? styles.slide : ""}
          `}
        >
          No tasks
        </li>
      )}
    </ul>
  );
};

export default TodoList;
