import type { UITask } from "@/entities/task";
import type {
  ToggleTaskAction,
  DeleteTaskAction,
} from "@/features/tasks-management";
import { memo, useEffect, useRef, useState } from "react";
import { useTasksNavigationStore } from "@/shared/model/navigation/tasksNavigationStore";
import { handleMutationError } from "@/shared/lib/error-handlers";
import { useAnimationStore } from "@/shared/lib/animation/animationStore";
import { useNavigate } from "react-router";
import DeleteIcon from "@/shared/assets/icons/delete-icon.svg?react";
import GoToIcon from "@/shared/assets/icons/chevrons-left.svg?react";
import styles from "./TodoItem.module.scss";
import toast from "react-hot-toast";

type TodoItemProps = {
  className?: string;
  task: UITask;
  toggleTask: ToggleTaskAction;
  deleteTask: DeleteTaskAction;
  isHighlighted: boolean;
};

const isOptimistic = (id: string) => id.startsWith("optimistic-");

const TodoItem = (props: TodoItemProps) => {
  const { className, task, toggleTask, deleteTask, isHighlighted } = props;

  const [visibleHighlight, setVisibleHighlight] = useState(false);

  const { allowTasksAnimation, blockTasksAnimation, blockPanelAnimation } =
    useAnimationStore.getState();
  const { setScrollY } = useTasksNavigationStore.getState();

  const isTogglingRef = useRef(false);
  const isDeletingRef = useRef(false);

  const navigate = useNavigate();

  const handleNavigate = () => {
    blockTasksAnimation();
    blockPanelAnimation();

    setScrollY(window.scrollY);

    navigate(`/tasks/${task.id}`);
  };

  const handleToggle = async () => {
    if (isTogglingRef.current) return;

    isTogglingRef.current = true;

    try {
      await toggleTask(task.id, !task.isDone);
    } catch (error: unknown) {
      if (handleMutationError(error)) return;

      toast.error("Server sync failed");
    } finally {
      isTogglingRef.current = false;
    }
  };

  const handleDelete = async () => {
    if (isDeletingRef.current) return;

    isDeletingRef.current = true;

    allowTasksAnimation();

    try {
      await deleteTask(task.id);
    } catch (error: unknown) {
      if (handleMutationError(error)) return;

      toast.error("Server sync failed");
    } finally {
      isDeletingRef.current = false;
    }
  };

  useEffect(() => {
    if (isHighlighted) {
      setVisibleHighlight(true);
    }
  }, [isHighlighted]);

  return (
    <div
      className={`
          ${styles.content} 
          ${visibleHighlight ? styles.highlight : ""}
          ${isOptimistic(task.id) ? styles.isAdding : ""}
          ${className ?? ""}
        `}
      onAnimationEnd={() => setVisibleHighlight(false)}
    >
      <input
        className={styles.checkbox}
        onChange={handleToggle}
        checked={task.isDone}
        id={task.id}
        type="checkbox"
        aria-label="Toggle task completion"
      />
      <label className={styles.label} htmlFor={task.id}>
        {task.title}
      </label>
      <div className={styles.buttonGroup}>
        <button
          className={styles.actionButton}
          onClick={handleNavigate}
          type="button"
          aria-label="Go to task"
        >
          <GoToIcon className={styles.actionIcon} aria-hidden="true" />
        </button>
        <button
          className={styles.actionButton}
          onClick={handleDelete}
          type="button"
          aria-label="Delete task"
        >
          <DeleteIcon className={styles.actionIcon} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default memo(TodoItem);
