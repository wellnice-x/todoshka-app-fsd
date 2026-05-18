import toast from "react-hot-toast";
import styles from "./Header.module.scss";
import SunIcon from "@/shared/assets/icons/sun.svg?react";
import MoonIcon from "@/shared/assets/icons/moon.svg?react";
import Dropdown from "@/shared/ui/Dropdown";
import useAnonUser from "@/hooks/useAnonUser";
import ThemeToggle from "@/features/toggle-theme";
import ToggleButton from "@/shared/ui/ToggleButton";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import SettingsIcon from "@/shared/assets/icons/settings-icon.svg?react";
import ParallaxToggle from "@/features/toggle-parallax";
import ParallaxOnIcon from "@/shared/assets/icons/parallax-on-icon.svg?react";
import ParallaxOffIcon from "@/shared/assets/icons/parallax-off-icon.svg?react";
import useDeleteAccount from "@/hooks/useDeleteAccount";
import DeleteProfileIcon from "@/shared/assets/icons/delete-profile-icon.svg?react";
import MultiToggleButton from "@/shared/ui/MultiToggleButton";
import useServerAccessState from "@/hooks/useServerAccessState";
import useOptimisticModeToast from "@/hooks/useOptimisticModeToast";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import { useAppSettings } from "@/app/model/settings/appSettingsStore";
import { settingsUseCases } from "@/app/model/settings/settingsUseCases";
import { useAnimationStore } from "@/shared/lib/animation/model/animationStore";
import type { OptimisticMode } from "@/features/change-optimistic-mode";

type ModalAction = "deleteConfirm" | "deleteForce" | null;

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const { optimisticMode, isChaosMode, isOfflineMode, isBlockMutation } =
    useAppSettings();

  const blockTasksAnimation = useAnimationStore(
    (state) => state.blockTasksAnimation,
  );

  const {
    deleteAllData: deleteAccount,
    deleteLocalUserData,
    isDataDeleting,
  } = useDeleteAccount();

  const { userNickname } = useAnonUser();

  const { canAccessServer } = useServerAccessState();

  const [modalAction, setModalAction] = useState<ModalAction>(null);

  const navigate = useNavigate();

  useOptimisticModeToast();

  const handleForceDelete = () => {
    deleteLocalUserData();

    navigate("/auth");
  };

  const handleDeleteData = async () => {
    if (isDataDeleting) return;

    if (!canAccessServer) {
      handleForceDelete();

      return;
    }

    const result = await deleteAccount();

    if (result.status === "success") {
      navigate("/auth");
    }

    if (result.status === "failed") {
      setModalAction("deleteForce");
    }
  };

  const handleBlockMutationChange = () => {
    const result = settingsUseCases.toggleBlockMutation(canAccessServer);

    if (!result.ok) {
      toast(result.reason ?? "Unknown error", { icon: "⚠️" });
      return;
    }

    toast.success(
      result.enabled ? "Server mutations blocked" : "Server mutations unblocked",
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

  const modalConfig = {
    deleteConfirm: {
      title: "PLEASE, CONFIRM THE ACTION:",
      question: canAccessServer
        ? "Delete all your data permanently?\nThis cannot be undone ⚠️"
        : "No server connection 🌐⚠️\n\n" +
          "Delete only your local data and close the session? ➡️",

      confirmButtonText: "Delete",

      onConfirm: handleDeleteData,
    },

    deleteForce: {
      title: "PLEASE, CONFIRM THE ACTION:",
      question:
        "Connection issue 🌐⚠️\n" +
        "We couldn’t confirm that your data was deleted on the server.\n\n" +
        "Delete your local data and close the session? ➡️",

      confirmButtonText: "Delete",

      onConfirm: handleForceDelete,
    },
  };

  return (
    <header className={`${styles.header} ${className ?? ""}`}>
      <img
        className={styles.logo}
        src="/logo.png"
        alt="logo"
        width={120}
        height={120}
      />
      <div className={styles.actionsWrapper}>
        <div className={styles.accountActions}>
          <h2 className={styles.userName}>{userNickname}</h2>
          <button
            className={styles.logOutButton}
            onClick={() => setModalAction("deleteConfirm")}
            title="Delete the profile"
            type="button"
            disabled={isDataDeleting}
          >
            {isDataDeleting ? (
              <ClipLoader size={16} color="#ff3636" />
            ) : (
              <DeleteProfileIcon />
            )}
          </button>
        </div>
        <div className={styles.appActions}>
          <ParallaxToggle
            title="Toggle parallax"
            enabledParallaxIcon={<ParallaxOnIcon />}
            disabledParallaxIcon={<ParallaxOffIcon />}
          />
          <ThemeToggle
            title="Change theme"
            lightThemeIcon={<SunIcon />}
            darkThemeIcon={<MoonIcon />}
          />
          <Dropdown
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
        </div>
        {modalAction &&
          createPortal(
            <ConfirmModal
              title={modalConfig[modalAction].title}
              question={modalConfig[modalAction].question}
              leftButtonTitle={modalConfig[modalAction].confirmButtonText}
              onClose={() => setModalAction(null)}
              onConfirm={() => {
                modalConfig[modalAction].onConfirm();
              }}
            />,
            document.body,
          )}
      </div>
    </header>
  );
};

export default Header;
