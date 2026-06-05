import Button from "@/shared/ui/Button";
import styles from "./ConfirmModal.module.scss";
import { useRef, useEffect, useId } from "react";

type ConfirmModalProps = {
  className?: string;
  title: string;
  question: string;
  leftButtonTitle?: string;
  rightButtonTitle?: string;
  onClose?: () => void;
  onConfirm?: () => void;
};

const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    className,
    title,
    question,
    leftButtonTitle = "Ok",
    rightButtonTitle = "Cancel",
    onClose,
    onConfirm,
  } = props;

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const titleId = useId();
  const descriptionId = useId();

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    return () => dialog.close();
  }, []);

  return (
    <dialog
      className={`${styles.modal} ${className ?? ""}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      ref={dialogRef}
    >
      <h3 id={titleId} className={styles.title}>
        {title}
      </h3>
      <p id={descriptionId} className={styles.question}>
        {question}
      </p>
      <div className={styles.buttonGroup}>
        <Button type="button" onClick={handleConfirm} aria-label="confirm" autoFocus>
          {leftButtonTitle}
        </Button>
        <Button type="button" onClick={() => onClose?.()} aria-label="cancel">
          {rightButtonTitle}
        </Button>
      </div>
    </dialog>
  );
};

export default ConfirmModal;
