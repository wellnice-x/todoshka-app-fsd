import type { FieldHandle } from "@/shared/ui/Field";

import { useAnonUser } from "@/entities/user";
import Field from "@/shared/ui/Field";
import Button from "@/shared/ui/Button";
import { useAuth } from "@/shared/auth";
import { withTimeout } from "@/shared/lib/async";
import { TimeoutError } from "@/shared/lib/errors";
import { useRuntimeStore } from "@/shared/model";
import { useState, useRef, useEffect, SubmitEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
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

  const { authAnonymously, pauseAuthHandling, resumeAuthHandling } = useAuth();

  const { setUserNickname } = useAnonUser();

  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [shouldShowExtraButton, setShouldShowExtraButton] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [error, setError] = useState<string>("");

  const setIsTestMode = useRuntimeStore((state) => state.setIsTestMode);

  const navigate = useNavigate();

  const fieldHandleRef = useRef<FieldHandle>(null);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateUserNickname(nickname);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (isAuthenticating) return;

      resumeAuthHandling();

      setIsAuthenticating(true);

      await withTimeout(authAnonymously(), 10000);

      setUserNickname(nickname.trim());

      toast.remove();

      setIsAuthenticating(false);

      setIsTestMode(false);

      navigate("/tasks", { replace: true });
    } catch (error) {
      setIsAuthenticating(false);

      setShouldShowExtraButton(true);

      if (error instanceof TimeoutError) {
        toast.error("Server is not responding \n Please try again");
        toast.error(
          "Your internet provider may be blocking access to the server",
          {
            id: "authErrorAdviseToast",
            icon: "💡",
            duration: 5000,
            style: {
              width: "315px",
            },
          },
        );
      } else {
        toast.error("Failed to create a session");
      }
    }
  };

  const handleTestModeEntrance = async () => {
    const validationError = validateUserNickname(nickname);

    if (validationError) {
      setUserNickname("Anonymous");
    } else {
      setUserNickname(nickname.trim());
    }

    pauseAuthHandling();

    setIsTestMode(true);

    toast.remove();

    toast.success("Test Mode: \n Your changes won't be saved", {
      id: "testModeToast",
      icon: "💡",
      duration: 5000,
    });

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
      aria-label="Sign up"
      noValidate
    >
      <Field
        className={styles.field}
        label="User's nickname"
        placeholder="Enter your nickname..."
        value={nickname}
        onChange={handleChange}
        multiline={false}
        maxLength={22}
        isLabelHidden={true}
        error={error}
        ref={fieldHandleRef}
      />
      <Button className={styles.authButton} type="submit">
        {isAuthenticating ? (
          <ClipLoader size={16} color="var(--color-surface-primary)" />
        ) : (
          "Sign up anonymously"
        )}
      </Button>
      <Button
        className={`${styles.extraButton} ${shouldShowExtraButton ? styles.visible : ""}`}
        type="button"
        onClick={handleTestModeEntrance}
      >
        Continue without server
      </Button>
    </form>
  );
};

export default AuthForm;
