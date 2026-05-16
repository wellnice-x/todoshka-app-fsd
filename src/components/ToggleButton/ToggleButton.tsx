import styles from "./ToggleButton.module.scss";
import { useId } from "react";
import { InputHTMLAttributes } from "react";

type ToggleButtonProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const ToggleButton = (props: ToggleButtonProps) => {
  const uniqueId = useId();

  const { className, id = uniqueId, label, checked, onChange, ...rest } = props;

  return (
    <div className={`${styles.toggleButton} ${className ?? ""}`}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={styles.checkbox}
        onChange={onChange}
        checked={checked}
        type="checkbox"
        {...rest}
      />
    </div>
  );
};

export default ToggleButton;
