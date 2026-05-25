import type { OptimisticMode } from "@/shared/optimistic-mode";

import Dropdown from "@/shared/ui/Dropdown";
import ToggleButton from "@/shared/ui/ToggleButton";
import MultiToggleButton from "@/shared/ui/MultiToggleButton";
import SettingsIcon from "@/shared/assets/icons/settings-icon.svg?react";
import { useSettings } from "@/shared/model";
import { settingsUseCases } from "@/shared/model";
import { useServerAccessState } from "@/shared/model";
import { useAnimationStore } from "@/shared/lib/animation";
import toast from "react-hot-toast";
import styles from "./DeveloperSettingsMenu.module.scss";

type DeveloperSettingsMenuProps = {
  className?: string;
};

const DeveloperSettingsMenu = ({ className }: DeveloperSettingsMenuProps) => {
  const { optimisticMode, isChaosMode, isOfflineMode, isBlockMutation } =
    useSettings();

  const { canAccessServer } = useServerAccessState();

  const blockTasksAnimation = useAnimationStore(
    (state) => state.blockTasksAnimation,
  );

  const handleBlockMutationChange = () => {
    const result = settingsUseCases.toggleBlockMutation(canAccessServer);

    if (!result.ok) {
      toast(result.reason ?? "Unknown error", { icon: "⚠️" });
      return;
    }

    toast.success(
      result.enabled
        ? "Server mutations blocked"
        : "Server mutations unblocked",
    );
  };

  const handleOfflineModeChange = () => {
    const result = settingsUseCases.toggleOfflineMode(canAccessServer);

    if (!result.ok) {
      toast(result.reason ?? "Unknown error", { icon: "⚠️" });
      return;
    }

    toast.success(
      result.enabled
        ? "Offline mode activated. \n Your changes won't be saved"
        : "Offline mode deactivated",
      { duration: 3500 },
    );
  };

  const handleChaosModeChange = () => {
    const result = settingsUseCases.toggleChaosMode(canAccessServer);

    if (!result.ok) {
      toast(result.reason ?? "Unknown error", { icon: "⚠️" });
      return;
    }

    toast.success(
      result.enabled
        ? "Chaotic server mode activated. \n Get random delay and error chance"
        : "Chaotic server mode deactivated",
      { duration: 3500 },
    );
  };

  const handleSwitchOptimisticMode = (value: OptimisticMode) => {
    if (!canAccessServer && value === "none") {
      toast(
        "This mode requires server connection \n and doesn't support offline mode",
        {
          icon: "⚠️",
        },
      );

      return;
    }

    blockTasksAnimation();

    settingsUseCases.changeOptimisticMode(value);
  };

  return (
    <Dropdown
      className={`${styles.menu} ${className ?? ""}`}
      buttonTitle="Settings"
      buttonIcon={<SettingsIcon />}
      menuTitle="Developer settings"
    >
      <div className={styles.buttonsWrapper}>
        <div className={styles.toggleButtons}>
          <ToggleButton
            className={styles.toggleButton}
            label="Offline mode (Test UI):"
            checked={isOfflineMode}
            onChange={handleOfflineModeChange}
          />
          <ToggleButton
            className={styles.toggleButton}
            label="Block server mutations:"
            checked={isBlockMutation}
            onChange={handleBlockMutationChange}
          />
          <ToggleButton
            className={styles.toggleButton}
            label="Chaotic server mode:"
            checked={isChaosMode}
            onChange={handleChaosModeChange}
          />
        </div>
        <MultiToggleButton
          label="Optimistic mode:"
          labelPosition="top"
          value={optimisticMode}
          onChange={handleSwitchOptimisticMode}
          options={[
            { label: "Snapshots", value: "snapshots" },
            { label: "Patches", value: "patches" },
            { label: "None", value: "none" },
          ]}
        />
      </div>
    </Dropdown>
  );
};

export default DeveloperSettingsMenu;
