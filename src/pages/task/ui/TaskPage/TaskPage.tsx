import styles from "./TaskPage.module.scss";
import Button from "@/shared/ui/Button";
import TaskUpdateForm from "@/features/update-task";
import { ClipLoader } from "react-spinners";
import { useServerAccessState } from "@/shared/model";
import { useNavigate, useParams } from "react-router";
import {
  useTasksQueryState,
  useTasksStrategy,
} from "@/features/tasks-management";

const TaskPage = () => {
  const navigate = useNavigate();

  const { uiTasks, updateTaskInfoMutation } = useTasksStrategy();

  const { isLoading: tasksIsInitLoading } = useTasksQueryState();

  const { isServerAccessBlocked, isServerAccessUncertain } =
    useServerAccessState();

  const { id } = useParams();

  const task = id ? uiTasks.find((task) => task.id === id) : undefined;

  const handleNavigate = () => {
    navigate("/tasks");
  };

  const isNotReady =
    isServerAccessUncertain || (!isServerAccessBlocked && tasksIsInitLoading);

  const BackButton = (
    <Button
      className={styles.buttonBack}
      type="button"
      onClick={handleNavigate}
    >
      Go back
    </Button>
  );

  return (
    <main className={styles.main}>
      <h1 className={styles.mainTitle}>Current task</h1>
      <section className={styles.taskSection}>
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>Let's take a closer look</h2>
        </header>
        {isNotReady ? (
          <div className={styles.loaderWrapper}>
            <ClipLoader size={70} color="#44d8fd97" />
            {BackButton}
          </div>
        ) : task ? (
          <TaskUpdateForm
            task={task}
            onSuccess={handleNavigate}
            updateTaskInfoMutation={updateTaskInfoMutation}
          />
        ) : (
          <div className={styles.errorWrapper}>
            <p className={styles.error}>Task Not Found</p>
            {BackButton}
          </div>
        )}
      </section>
    </main>
  );
};

export default TaskPage;
