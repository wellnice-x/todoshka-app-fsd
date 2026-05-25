import type {
  DeleteCompletedTasksMutation,
  MarkAllTasksCompletedMutation,
} from "@/features/tasks-management";
import type { FilterState } from "@/shared/model";

import { useTasksBulkActions } from "@/widgets/todo/model/useTasksBulkActions";
import { useAnimationStore } from "@/shared/lib/animation";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { useFilter } from "@/shared/model";
import { createPortal } from "react-dom";
import { useState } from "react";
import styles from "./TodoActionsPanel.module.scss";

type ModalAction = "deleteAll" | "markAll" | null;

type TodoActionsPanelProps = {
  className?: string;
  completedTaskIds: string[];
  deleteCompletedTasksMutation: DeleteCompletedTasksMutation;
  markAllTasksCompletedMutation: MarkAllTasksCompletedMutation;
  uncompletedTasksCount: number;
};

const TodoActionsPanel = (props: TodoActionsPanelProps) => {
  const {
    className,
    completedTaskIds,
    deleteCompletedTasksMutation,
    markAllTasksCompletedMutation,
    uncompletedTasksCount,
  } = props;

  const [modalAction, setModalAction] = useState<ModalAction>(null);

  const { setSearchQuery, activeFilter, setActiveFilter } = useFilter();

  const blockTasksAnimation = useAnimationStore(
    (state) => state.blockTasksAnimation,
  );

  const { deleteCompletedTasks, markAllTasksCompleted } = useTasksBulkActions({
    deleteCompletedTasksMutation,
    markAllTasksCompletedMutation,
  });

  const modalConfig = {
    deleteAll: {
      title: "PLEASE, CONFIRM THE ACTION:",
      question: "Are you sure you want to delete all completed tasks?",
      confirmButtonText: "Delete",
      onConfirm: () => {
        deleteCompletedTasks(completedTaskIds);
      },
    },
    markAll: {
      title: "PLEASE, CONFIRM THE ACTION:",
      question: "Are you sure you want to mark all tasks as completed?",
      confirmButtonText: "Yes",
      onConfirm: () => {
        markAllTasksCompleted();
      },
    },
  };

  const handleFilterChange = (filter: FilterState) => {
    blockTasksAnimation();

    setActiveFilter(filter);
    setSearchQuery("");
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
