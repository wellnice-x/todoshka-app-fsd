import Todo from "@/widgets/todo";
import styles from "./TasksPage.module.scss";
import GoToTopButton from "@/shared/ui/GoToTopButton";

const TasksPage = () => {
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.mainTitle}>All tasks to do</h1>
        <section className={styles.todoAppSection}>
          <header className={styles.header}>
            <h2 className={styles.title}>Let's see...</h2>
          </header>
          <Todo />
        </section>
        <GoToTopButton />
      </main>
    </>
  );
};

export default TasksPage;
