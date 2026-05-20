import type { FilterState } from "@/features/filter-tasks";
import { useState } from "react";
import { useFilter } from "@/features/filter-tasks";
import { createPortal } from "react-dom";
import { useAnimation } from "@/shared/lib/animation/animationStore";
import { UseMutationResult } from "@tanstack/react-query";
import { handleMutationError } from "@/shared/lib/errors";
import { handleBulkMutationError } from "@/shared/lib/errors";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import styles from "./TodoActionsPanel.module.scss";
import toast from "react-hot-toast";

type ModalAction = "deleteAll" | "markAll" | null;

type TodoActionsPanelProps = {
  className?: string;
  completedTaskIds: string[];
  deleteCompletedTasksMutation: UseMutationResult<
    PromiseSettledResult<{ taskId: string }>[] | undefined,
    Error,
    { taskIds: string[] }
  >;
  markAllCompletedMutation: UseMutationResult<void, Error, void>;
  uncompletedTasksCount: number;
};

const TodoActionsPanel = (props: TodoActionsPanelProps) => {
  const {
    className,
    completedTaskIds,
    deleteCompletedTasksMutation,
    markAllCompletedMutation,
    uncompletedTasksCount,
  } = props;

  const [modalAction, setModalAction] = useState<ModalAction>(null);

  const { setSearchQuery, activeFilter, setActiveFilter } = useFilter();

  const { blockTasksAnimation, allowTasksAnimation } = useAnimation();

  const modalConfig = {
    deleteAll: {
      title: "PLEASE, CONFIRM THE ACTION:",
      question: "Are you sure you want to delete all completed tasks?",
      confirmButtonText: "Delete",
      onConfirm: () => {
        handleDelete();
      },
    },
    markAll: {
      title: "PLEASE, CONFIRM THE ACTION:",
      question: "Are you sure you want to mark all tasks as completed?",
      confirmButtonText: "Yes",
      onConfirm: () => {
        handleMarkAllCompleted();
      },
    },
  };

  const handleFilterChange = (filter: FilterState) => {
    blockTasksAnimation();

    setActiveFilter(filter);
    setSearchQuery("");
  };

  const handleDelete = () => {
    if (deleteCompletedTasksMutation.isPending) return;

    allowTasksAnimation();

    deleteCompletedTasksMutation.mutate(
      {
        taskIds: completedTaskIds,
      },
      {
        onSuccess: () => {
          toast.success("Completed tasks deleted");
        },
        onError: (error) => {
          handleBulkMutationError(error);
        },
      },
    );
  };

  const handleMarkAllCompleted = () => {
    if (markAllCompletedMutation.isPending) return;

    markAllCompletedMutation.mutate(undefined, {
      onError: (error) => {
        if (handleMutationError(error)) return;

        toast.error("Server sync failed");
      },
    });
  };

  const itemsText = uncompletedTasksCount === 1 ? "task" : "tasks";

  return (
    <div className={`${styles.panel} ${className ?? ""}`}>
      <button
        className={styles.completeAllButton}
        onClick={() => setModalAction("markAll")}
        disabled={uncompletedTasksCount === 0}
      >
        <span className={styles.defaultText}>
          {uncompletedTasksCount} {itemsText} left
        </span>
        <span className={styles.hoverText}>Complete all</span>
      </button>
      <div className={styles.buttonGroup}>
        <button
          className={activeFilter === "all" ? styles.isActive : ""}
          onClick={() => handleFilterChange("all")}
          type="button"
          aria-pressed={activeFilter === "all"}
        >
          All
        </button>
        <button
          className={activeFilter === "active" ? styles.isActive : ""}
          onClick={() => handleFilterChange("active")}
          type="button"
          aria-pressed={activeFilter === "active"}
        >
          Active
        </button>
        <button
          className={activeFilter === "completed" ? styles.isActive : ""}
          onClick={() => handleFilterChange("completed")}
          type="button"
          aria-pressed={activeFilter === "completed"}
        >
          Completed
        </button>
      </div>
      <button
        className={styles.clearButton}
        onClick={() => setModalAction("deleteAll")}
        disabled={completedTaskIds.length === 0}
        type="button"
      >
        Delete completed
      </button>
      {modalAction &&
        createPortal(
          <ConfirmModal
            title={modalConfig[modalAction].title}
            question={modalConfig[modalAction].question}
            leftButtonTitle={modalConfig[modalAction].confirmButtonText}
            onClose={() => setModalAction(null)}
            onConfirm={() => {
              modalConfig[modalAction].onConfirm();
            }}
          />,
          document.body,
        )}
    </div>
  );
};

export default TodoActionsPanel;
