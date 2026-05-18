import { useState } from "react";
import { withTimeout } from "@/shared/lib/async/withTimeout";
import { useErrorStore } from "@/stores/errorStore";
import { useUIKeyStore } from "@/stores/uiKeyStore";
import { useFilterStore } from "@/stores/filterStore";
import { useQueryClient } from "@tanstack/react-query";
import { useTasksPageStore } from "@/stores/tasksPageStore";
import { useAnimationStore } from "@/stores/animationStore";
import { useConnectionStore } from "@/stores/connectionStore";
import { useAppRuntimeStore } from "@/stores/appRuntimeStore";
import { useAppearanceStore } from "@/stores/appearanceStore";
import { useAppSettingsStore } from "@/stores/appSettingsStore";
import deleteServerUserData from "@/features/delete-account/model/deleteUserAccount";

type DeleteResult = { status: "success" } | { status: "failed" };

const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  const [isDataDeleting, setIsDataDeleting] = useState(false);

  const resetAllStores = () => {
    useUIKeyStore.getState().reset();
    useErrorStore.getState().reset();
    useFilterStore.getState().reset();
    useTasksPageStore.getState().reset();
    useAnimationStore.getState().reset();
    useAppearanceStore.getState().reset();
    useConnectionStore.getState().reset();
    useAppSettingsStore.getState().reset();
  };

  const deleteLocalUserData = () => {
    queryClient.clear();
    localStorage.clear();
    resetAllStores();
    useAppRuntimeStore.getState().resetSession();
  };

  const deleteAllData = async (): Promise<DeleteResult> => {
    setIsDataDeleting(true);

    try {
      await withTimeout(deleteServerUserData(), 20000);

      deleteLocalUserData();

      return { status: "success" };
    } catch {
      return { status: "failed" };
    } finally {
      setIsDataDeleting(false);
    }
  };

  return {
    deleteAllData,
    deleteLocalUserData,
    isDataDeleting,
  };
};

export default useDeleteAccount;
