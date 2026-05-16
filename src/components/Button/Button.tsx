import styles from "./Button.module.scss";
import { PropsWithChildren, ButtonHTMLAttributes } from "react";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    isDisabled?: boolean;
  }
>;

const Button = (props: ButtonProps) => {
  const {
    className,
    type = "button",
    onClick,
    children,
    isDisabled,
    ...rest
  } = props;

  return (
    <button
      className={`${styles.button} ${className ?? ""}`}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
