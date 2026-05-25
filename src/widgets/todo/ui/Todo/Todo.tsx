import TodoList from "../TodoList";
import TodoActionsPanel from "../TodoActionsPanel";
import { useIsTasksMutating } from "@/features/tasks-management";
import { useTaskStableActions } from "@/features/tasks-management";
import {
  useTasksQueryState,
  useTasksStrategy,
} from "@/features/tasks-management";
import AddTaskForm from "@/features/add-task";
import SearchTaskForm from "@/features/search-task";
import { useFilteredTasks } from "@/entities/task";
import { useIsMobile } from "@/shared/lib/device";
import { usePageOverflow } from "@/shared/lib/page";
import { useAnimationStore } from "@/shared/lib/animation";
import { useConsumeScrollY } from "@/shared/model";
import ReactIcon from "@/shared/assets/icons/react-icon.svg?react";
import { BeatLoader } from "react-spinners";
import { PuffLoader } from "react-spinners";
import { useRef } from "react";
import styles from "./Todo.module.scss";

const Todo = () => {
  const { isLoading: tasksIsInitLoading, isRefetching: tasksIsRefetching } =
    useTasksQueryState();

  const {
    uiTasks: tasks,
    addTaskMutation,
    deleteTaskMutation,
    toggleTaskMutation,
    deleteCompletedTasksMutation,
    markAllTasksCompletedMutation,
  } = useTasksStrategy();

  const { toggleTask, deleteTask } = useTaskStableActions({
    toggleTaskMutation,
    deleteTaskMutation,
  });

  const shouldPanelAnimate = useAnimationStore(
    (state) => state.shouldPanelAnimate,
  );

  const todoRef = useRef<HTMLDivElement>(null);

  const isNonOptimisticMutating = useIsTasksMutating("none");

  const isMobile = useIsMobile();

  const isNoTasks = tasks.length === 0;

  const completedTaskIds = tasks.reduce<string[]>((acc, task) => {
    if (task.isDone) {
      acc.push(task.id);
    }
    return acc;
  }, []);

  const uncompletedTasksCount = tasks.length - completedTaskIds.length;

  const isOverflowing = usePageOverflow();

  const isTopPanel = isOverflowing || isMobile;

  const filteredTasks = useFilteredTasks(tasks);

  useConsumeScrollY();

  return (
    <div className={styles.todo} ref={todoRef}>
      <AddTaskForm
        className={styles.addForm}
        addTaskMutation={addTaskMutation}
        shouldShowToast={isTopPanel}
      />
      <SearchTaskForm className={styles.searchForm} />
      <TodoList
        className={styles.list}
        currentTasks={filteredTasks}
        isNoTasksAtAll={isNoTasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        roundingPosition={isTopPanel ? "bottom" : "top"}
      />
      <TodoActionsPanel
        className={`
          ${styles.actionsPanel}
          ${isTopPanel ? styles.topPosition : ""}
          ${shouldPanelAnimate && !isMobile ? styles.animatedPanel : ""}
        `}
        completedTaskIds={completedTaskIds}
        deleteCompletedTasksMutation={deleteCompletedTasksMutation}
        markAllTasksCompletedMutation={markAllTasksCompletedMutation}
        uncompletedTasksCount={uncompletedTasksCount}
      />
      {tasksIsInitLoading && (
        <div
          className={styles.initLoaderWrapper}
          title="Init loading..."
          role="status"
          aria-live="polite"
        >
          <BeatLoader size={12} color="#44d8fd97" />
        </div>
      )}
      {(tasksIsRefetching || isNonOptimisticMutating) && (
        <div
          className={styles.loaderWrapper}
          title="Syncing..."
          role="status"
          aria-live="polite"
        >
          <PuffLoader size={16} color="#00ccffd3" />
        </div>
      )}
      <p className={styles.info}>
        Powered by React <ReactIcon />
      </p>
    </div>
  );
};

export default Todo;
