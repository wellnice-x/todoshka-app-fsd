import styles from "./Todo.module.scss";
import TodoList from "@/widgets/task-list";
import ReactIcon from "@/shared/assets/icons/react-icon.svg?react";
import useIsMobile from "@/shared/lib/device/useIsMobile";
import AddTaskForm from "@/features/add-task";
import SearchTaskForm from "@/features/search-task";
import TodoActionsPanel from "@/widgets/todo-actions-panel";
import { useFilter } from "@/features/filter-tasks";
import { BeatLoader } from "react-spinners";
import { PuffLoader } from "react-spinners";
import { useAnimationStore } from "@/shared/lib/animation/animationStore";
import { useIsTasksMutating } from "@/features/tasks-management";
import { useTaskStableActions } from "@/features/tasks-management";
import { useTasksNavigationStore } from "@/features/tasks-navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  useTasksQueryState,
  useTasksStrategy,
} from "@/features/tasks-management";

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

  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

  const consumeScrollY = useTasksNavigationStore(
    (state) => state.consumeScrollY,
  );
  const shouldPanelAnimate = useAnimationStore(
    (state) => state.shouldPanelAnimate,
  );

  const { activeFilter, searchQuery } = useFilter();

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

  const isTopPanel = isOverflowing || isMobile;

  const filteredTasks = useMemo(() => {
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

  useLayoutEffect(() => {
    const checkOverflow = () => {
      setIsOverflowing(
        document.documentElement.scrollHeight > window.innerHeight,
      );
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);

    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const scroll = consumeScrollY();

    if (scroll !== null) {
      window.scrollTo({
        top: scroll,
        behavior: "instant",
      });
    }
  }, [consumeScrollY]);

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
