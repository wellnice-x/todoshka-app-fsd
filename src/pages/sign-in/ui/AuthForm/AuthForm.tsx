import type { FieldHandle } from "@/shared/ui/Field";

import { useAnonUser } from "@/entities/user";
import Field from "@/shared/ui/Field";
import Button from "@/shared/ui/Button";
import { useAuth } from "@/shared/auth";
import { useNavigate } from "react-router";
import { useState, useRef, useEffect, SubmitEvent, ChangeEvent } from "react";
import styles from "./AuthForm.module.scss";
import toast from "react-hot-toast";

type AuthFormProps = {
  className?: string;
};

const validateUserNickname = (value: string): string => {
  if (!value.trim()) {
    return value.length
      ? "The field cannot contain only spaces"
      : "The field cannot be empty";
  }

  return "";
};

const AuthForm = (props: AuthFormProps) => {
  const { className } = props;

  const { authAnonymously } = useAuth();

  const { setUserNickname } = useAnonUser();

  const [nickname, setNickname] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const fieldHandleRef = useRef<FieldHandle>(null);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateUserNickname(nickname);

    if (validationError) {
      setError(validationError);
      return;
    }

    authAnonymously();

    setUserNickname(nickname.trim());

    toast.remove();

    navigate("/tasks", { replace: true });
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { value } = event.target;

    setNickname(value);

    setError(value ? validateUserNickname(value) : "");
  };

  useEffect(() => {
    fieldHandleRef.current?.focus();
  }, []);

  return (
    <form
      className={`${styles.form} ${className ?? ""}`}
      onSubmit={handleSubmit}
      aria-label="Sign in"
      noValidate
    >
      <Field
        className={styles.field}
        label="User's nickname"
        placeholder="Enter your nickname..."
        value={nickname}
        onChange={handleChange}
        multiline={false}
        maxLength={30}
        isLabelHidden={true}
        error={error}
        ref={fieldHandleRef}
      />
      <Button className={styles.button} type="submit">
        Sign in anonymously
      </Button>
    </form>
  );
};

export default AuthForm;
