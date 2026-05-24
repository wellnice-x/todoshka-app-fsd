import type { UITask } from "@/entities/task";
import type {
  ToggleTaskAction,
  DeleteTaskAction,
} from "@/features/tasks-management";
import { useTasksNavigationStore } from "@/shared/model";
import { AnimatePresence } from "motion/react";
import { useFilter } from "@/shared/model";
import { useEffect } from "react";
import TodoListItemMotion from "@/widgets/todo/ui/TodoListItemMotion";
import TodoItem from "@/widgets/todo/ui/TodoItem";
import styles from "./TodoList.module.scss";

type TodoListProps = {
  className?: string;
  currentTasks: UITask[];
  isNoTasksAtAll: boolean;
  toggleTask: ToggleTaskAction;
  deleteTask: DeleteTaskAction;
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

  const highlightedTaskId = useTasksNavigationStore(
    (state) => state.highlightedTaskId,
  );
  const consumeHighlight = useTasksNavigationStore(
    (state) => state.consumeHighlight,
  );

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
            <TodoListItemMotion className={styles.item} key={task.__uiKey}>
              <TodoItem
                task={task}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                isHighlighted={task.id === highlightedTaskId}
              />
            </TodoListItemMotion>
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
