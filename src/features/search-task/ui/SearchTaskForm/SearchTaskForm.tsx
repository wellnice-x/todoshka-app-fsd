import Field from "@/shared/ui/Field";
import XIcon from "@/shared/assets/icons/x-icon.svg?react";
import styles from "./SearchTaskForm.module.scss";
import SearchIcon from "@/shared/assets/icons/search-icon.svg?react";
import { useFilter } from "@/features/filter-tasks";
import { ChangeEvent, useState } from "react";

type SearchTaskFormProps = {
  className?: string;
};

const SearchTaskForm = ({ className }: SearchTaskFormProps) => {
  const { searchQuery, setSearchQuery, setActiveFilter } = useFilter();

  const [error, setError] = useState<string>("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const trimmedValue = value.trim();

    if (trimmedValue.length > 0) {
      setActiveFilter("all");
    }

    setSearchQuery(value);

    const hasOnlySpaces = value.length > 0 && trimmedValue.length === 0;
    setError(hasOnlySpaces ? "The field cannot contain only spaces" : "");
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
    setError("");
  };

  return (
    <form
      className={`${styles.form ?? ""} ${className ?? ""}`}
      onSubmit={(event) => event.preventDefault()}
      aria-label="Search task"
      noValidate
    >
      <Field
        id="searchInput"
        type="search"
        multiline={false}
        label="search query by title"
        isLabelHidden={true}
        className={styles.field}
        placeholder="Search a task..."
        startIcon={
          <SearchIcon className={styles.searchIcon} aria-hidden="true" />
        }
        endIconButton={searchQuery ? <XIcon /> : null}
        value={searchQuery}
        onChange={onChange}
        endIconButtonClick={clearSearchQuery}
        endIconButtonAriaLabel="Clear search query"
        error={error}
      />
    </form>
  );
};

export default SearchTaskForm;
