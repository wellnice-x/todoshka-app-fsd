import { useState } from "react";
import { withTimeout } from "@/shared/lib/async";
import { useUIKeyStore } from "@/entities/task";
import { useFilterStore } from "@/shared/model";
import { useQueryClient } from "@tanstack/react-query";
import { useRuntimeStore } from "@/shared/model";
import { useSettingsStore } from "@/shared/model";
import { useAnimationStore } from "@/shared/lib/animation";
import { useConnectionStore } from "@/shared/model";
import { useAppearanceStore } from "@/shared/model";
import { useGlobalErrorStore } from "@/shared/model";
import { deleteServerUserData } from "./deleteUserAccount";
import { useTasksNavigationStore } from "@/shared/model";

type DeleteResult = { status: "success" } | { status: "failed" };

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  const [isDataDeleting, setIsDataDeleting] = useState(false);

  const resetAllStores = () => {
    useUIKeyStore.getState().reset();
    useFilterStore.getState().reset();
    useSettingsStore.getState().reset();
    useAnimationStore.getState().reset();
    useAppearanceStore.getState().reset();
    useConnectionStore.getState().reset();
    useGlobalErrorStore.getState().reset();
    useTasksNavigationStore.getState().reset();
  };

  const deleteLocalUserData = () => {
    queryClient.clear();
    localStorage.clear();
    resetAllStores();
    useRuntimeStore.getState().resetSession();
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