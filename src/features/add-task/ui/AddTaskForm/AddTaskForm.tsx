import type { Task } from "@/entities/task";
import type { FieldHandle } from "@/shared/ui/Field";
import { useState, useRef, useEffect, ChangeEvent, SubmitEvent } from "react";
import { handleMutationError } from "@/shared/lib/error-handlers";
import { UseMutationResult } from "@tanstack/react-query";
import { useAnimationStore } from "@/shared/lib/animation/animationStore";
import { useFilter } from "@/features/filter-tasks";
import PlusCircleIcon from "@/shared/assets/icons/plus-circle.svg?react";
import useIsMobile from "@/shared/lib/device/useIsMobile";
import styles from "./AddTaskForm.module.scss";
import Button from "@/shared/ui/Button";
import XIcon from "@/shared/assets/icons/x-icon.svg?react";
import Field from "@/shared/ui/Field";
import toast from "react-hot-toast";

type AddTaskVariables = {
  title: string;
};

type AddTaskFormProps = {
  className?: string;
  addTaskMutation: UseMutationResult<Task | undefined, Error, AddTaskVariables>;
  shouldShowToast?: boolean;
};

const validateTaskTitle = (value: string): string => {
  if (!value.trim()) {
    return value.length
      ? "The field cannot contain only spaces"
      : "The field cannot be empty";
  }

  return "";
};

const AddTaskForm = (props: AddTaskFormProps) => {
  const { className, addTaskMutation, shouldShowToast = false } = props;

  const { setActiveFilter, setSearchQuery } = useFilter();

  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [error, setError] = useState<string>("");

  const allowTasksAnimation = useAnimationStore(
    (state) => state.allowTasksAnimation,
  );

  const isMobile = useIsMobile();

  const fieldHandleRef = useRef<FieldHandle>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setErrorWithTimeout = (message: string) => {
    setError(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setError("");
    }, 3000);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (addTaskMutation.isPending) return;

    setActiveFilter("all");
    setSearchQuery("");

    requestAnimationFrame(() => {
      allowTasksAnimation();
    });

    const validationError = validateTaskTitle(newTaskTitle);

    if (validationError) {
      setErrorWithTimeout(validationError);
      return;
    }

    const title = newTaskTitle.trim();

    try {
      await addTaskMutation.mutateAsync({ title });

      setNewTaskTitle("");
      setError("");

      if (shouldShowToast) {
        toast.success("Task created", { duration: 1000 });
      }

      if (!isMobile) {
        fieldHandleRef.current?.focus();
      }
    } catch (error: unknown) {
      if (handleMutationError(error)) return;

      toast.error("Server sync failed");
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { value } = event.target;

    setNewTaskTitle(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setError(value ? validateTaskTitle(value) : "");
  };

  const clearTitle = () => {
    setNewTaskTitle("");
    setError("");
  };

  const clearButton = (
    <button className={styles.clearButton} type="button" onClick={clearTitle}>
      <XIcon />
    </button>
  );

  useEffect(() => {
    if (!isMobile) {
      fieldHandleRef.current?.focus();
    }
  }, [isMobile]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <form
      className={`${styles.form} ${className ?? ""}`}
      onSubmit={handleSubmit}
      aria-label="Add task"
      noValidate
    >
      <Field
        className={styles.field}
        id="addTaskField"
        value={newTaskTitle}
        onChange={handleChange}
        multiline={true}
        maxLength={130}
        label="Task title"
        isLabelHidden={true}
        placeholder="Your task title…"
        startIcon={
          newTaskTitle.length ? (
            clearButton
          ) : (
            <PlusCircleIcon className={styles.circle} aria-hidden="true" />
          )
        }
        error={error}
        ref={fieldHandleRef}
      />
      <Button className={styles.createButton} type="submit">
        Create
      </Button>
    </form>
  );
};

export default AddTaskForm;
