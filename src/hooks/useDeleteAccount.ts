import { useState } from "react";
import { withTimeout } from "@/shared/lib/async/withTimeout";
import { useUIKeyStore } from "@/entities/task";
import { useFilterStore } from "@/features/filter-tasks";
import { useQueryClient } from "@tanstack/react-query";
import { useTasksPageStore } from "@/pages/tasks";
import { useAnimationStore } from "@/shared/lib/animation/model/animationStore";
import { useConnectionStore } from "@/shared/api/network/model/connectionStore";
import { useAppRuntimeStore } from "@/app/model/appRuntimeStore";
import { useAppearanceStore } from "@/app/model/appearanceStore";
import { useAppSettingsStore } from "@/app/model/settings/appSettingsStore";
import { useGlobalErrorStore } from "@/app/model/globalErrorStore";
import { deleteServerUserData } from "@/features/delete-account";

type DeleteResult = { status: "success" } | { status: "failed" };

const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  const [isDataDeleting, setIsDataDeleting] = useState(false);

  const resetAllStores = () => {
    useUIKeyStore.getState().reset();
    useFilterStore.getState().reset();
    useTasksPageStore.getState().reset();
    useAnimationStore.getState().reset();
    useAppearanceStore.getState().reset();
    useConnectionStore.getState().reset();
    useAppSettingsStore.getState().reset();
    useGlobalErrorStore.getState().reset();
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
