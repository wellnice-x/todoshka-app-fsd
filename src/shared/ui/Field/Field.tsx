import styles from "./Field.module.scss";
import {
  Ref,
  useId,
  useRef,
  ReactNode,
  ChangeEvent,
  useLayoutEffect,
  InputHTMLAttributes,
  useImperativeHandle,
  TextareaHTMLAttributes,
} from "react";

export type FieldHandle = {
  focus: () => void;
};

type BaseProps = {
  className?: string;
  id?: string;
  label: string;
  isLabelHidden?: boolean;
  placeholder?: string;
  startIcon?: ReactNode;
  endIconButton?: ReactNode;
  endIconButtonAriaLabel?: string;
  endIconButtonClick?: () => void;
  defaultValue?: string;
  readOnly?: boolean;
  value?: string;
  maxLength?: number;
  error?: string;
};

type InputFieldProps = BaseProps & {
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  multiline: false;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
};

type TextAreaFieldProps = BaseProps & {
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  multiline: true;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

type FieldProps = (InputFieldProps | TextAreaFieldProps) & {
  ref?: Ref<FieldHandle>;
};

const Field = (props: FieldProps) => {
  const uniqueId = useId();

  const {
    className,
    id = uniqueId,
    label,
    isLabelHidden,
    placeholder,
    startIcon,
    endIconButton,
    endIconButtonAriaLabel,
    endIconButtonClick,
    defaultValue,
    maxLength,
    readOnly,
    value,
    error,
    ref,
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const errorId = `${id}-error`;

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        if (props.multiline) {
          textAreaRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      },
    }),
    [props.multiline],
  );

  useLayoutEffect(() => {
    if (!props.multiline) return;

    const textArea = textAreaRef.current;

    if (!textArea) return;

    const prevHeight = textArea.getBoundingClientRect().height;

    textArea.style.height = "auto";

    const nextHeight = textArea.scrollHeight;

    textArea.style.height = prevHeight + "px";

    requestAnimationFrame(() => {
      textArea.style.height = nextHeight + "px";
    });
  }, [value, props.multiline]);

  return (
    <div
      className={`
        ${styles.field} 
        ${error ? styles.isErrorField : ""}
        ${isLabelHidden ? styles.labelHidden : ""} 
        ${className ?? ""}
      `}
    >
      {startIcon && <div className={styles.startIcon}>{startIcon}</div>}
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {props.multiline ? (
        <textarea
          className={styles.textarea}
          id={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          readOnly={readOnly}
          rows={1}
          value={value}
          onChange={props.onChange}
          ref={textAreaRef}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-errormessage={error ? errorId : undefined}
        />
      ) : (
        <input
          className={styles.input}
          id={id}
          type={props.type ?? "text"}
          placeholder={placeholder}
          readOnly={readOnly}
          defaultValue={defaultValue}
          value={value}
          onChange={props.onChange}
          ref={inputRef}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-errormessage={error ? errorId : undefined}
        />
      )}
      {endIconButton && (
        <button
          className={styles.endIconButton}
          onClick={endIconButtonClick}
          aria-label={endIconButtonAriaLabel}
          type="button"
        >
          {endIconButton}
        </button>
      )}
      {error && (
        <span className={styles.error} id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Field;
