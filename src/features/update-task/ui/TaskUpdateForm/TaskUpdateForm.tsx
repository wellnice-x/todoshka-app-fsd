import type { UpdateTaskInfoMutation } from "@/features/tasks-management";
import type { Task } from "@/entities/task";
import Field from "@/shared/ui/Field";
import toast from "react-hot-toast";
import Button from "@/shared/ui/Button";
import styles from "./TaskUpdateForm.module.scss";
import { useState, ChangeEvent, SubmitEvent, useEffect } from "react";
import { useTasksNavigationStore } from "@/shared/model/navigation/tasksNavigationStore";
import { handleMutationError } from "@/shared/lib/error-handlers";
import { formatDate } from "@/shared/lib/date/formatDate";
import { ClipLoader } from "react-spinners";

type TaskUpdateFormProps = {
  className?: string;
  task: Task;
  updateTaskInfoMutation: UpdateTaskInfoMutation;
  onSuccess?: () => void;
};

const validateTaskTitle = (value: string): string => {
  if (!value.trim()) {
    return value.length
      ? "The field cannot contain only spaces"
      : "The field cannot be empty";
  }

  return "";
};

const TaskUpdateForm = (props: TaskUpdateFormProps) => {
  const { className, task, updateTaskInfoMutation, onSuccess } = props;

  const [error, setError] = useState<string>("");
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");

  const { setHighlightedTaskId } = useTasksNavigationStore.getState();

  const isUpdatingTask =
    updateTaskInfoMutation.isPending &&
    updateTaskInfoMutation.variables?.taskId === task.id;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUpdatingTask) return;

    const validationError = validateTaskTitle(newTaskTitle);

    if (validationError) {
      setError(validationError);
      return;
    }

    const trimmedTitle = newTaskTitle.trim();
    const trimmedDescription = newTaskDescription.trim();

    const isTitleNotChanged = task.title === trimmedTitle;
    const isDescriptionNotChanged =
      (task.description ?? "") === trimmedDescription;

    if (isTitleNotChanged && isDescriptionNotChanged) {
      onSuccess?.();
      return;
    }

    updateTaskInfoMutation.mutate(
      { taskId: task.id, title: trimmedTitle, description: trimmedDescription },
      {
        onError: (error) => {
          if (handleMutationError(error)) return;

          toast.error("Server sync failed");
        },
        onSuccess: () => {
          setHighlightedTaskId(task.id);

          toast.success("Task updated");

          onSuccess?.();
        },
      },
    );
  };

  const handleTitleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { value } = event.target;

    setNewTaskTitle(value);

    setError(value ? validateTaskTitle(value) : "");
  };

  const handleDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { value } = event.target;

    setNewTaskDescription(value);
  };

  useEffect(() => {
    if (isUpdatingTask) return;

    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description ?? "");
  }, [task, isUpdatingTask]);

  return (
    <form
      className={`${styles.form} ${className ?? ""}`}
      onSubmit={handleSubmit}
      aria-label="Update task info"
      noValidate
    >
      <div className={styles.fieldGroup}>
        <Field
          className={styles.titleField}
          label="Title:"
          placeholder="Task title..."
          value={newTaskTitle}
          onChange={handleTitleChange}
          multiline={true}
          error={error}
          maxLength={130}
        />
        <Field
          className={styles.descriptionField}
          label="Description:"
          placeholder="Describe the details..."
          value={newTaskDescription}
          onChange={handleDescriptionChange}
          multiline={true}
          maxLength={450}
        />
        <div className={styles.dateInfo}>
          <span>Created at:</span>
          <p className={styles.dateValue}>{formatDate(task.createdAt)}</p>
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <Button
          className={styles.button}
          disabled={isUpdatingTask}
          type="submit"
        >
          {isUpdatingTask ? (
            <ClipLoader size={16} color="var(--color-surface-primary)" />
          ) : (
            "Save and back"
          )}
        </Button>
        <Button
          className={styles.button}
          type="button"
          onClick={() => onSuccess?.()}
        >
          Back
        </Button>
      </div>
    </form>
  );
};

export default TaskUpdateForm;
