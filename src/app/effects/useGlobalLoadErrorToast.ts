import toast from "react-hot-toast";
import { useTasks } from "@/features/tasks-management";
import { useEffect } from "react";
import { useLoadErrorStatus } from "@/shared/model/errors";
import { useGlobalErrorStore } from "@/shared/model/errors";

export const useGlobalLoadErrorToast = () => {
  const { error, tasksIsFetching } = useTasks();

  const loadError = useLoadErrorStatus(tasksIsFetching ? null : error);

  const setLoadErrorShown = useGlobalErrorStore((state) => state.setLoadErrorShown);

  const showErrorToast = (title: string) => {
    toast.error(title, {
      id: "loadErrorToast",
      duration: 5000,
    });
  };

  const showAdviceToast = (title: string) => {
    toast.error(title, {
      id: "loadErrorAdviseToast",
      icon: "💡",
      duration: 7000,
    });
  };

  useEffect(() => {
    if (!loadError) return;

    setLoadErrorShown(true);

    if (loadError === "auth") {
      showErrorToast(
        "Failed to get data from the server: \n AUTHENTICATION ERROR",
      );
      showAdviceToast(
        "You can still test the app's interface \n but your changes won't be saved",
      );
    } else if (loadError === "server") {
      showErrorToast("Failed to get data: \n SERVER ERROR");
      showAdviceToast(
        "You can enable Offline Mode \n in Settings to test the interface",
      );
    } else if (loadError === "timeout") {
      showErrorToast("Failed to get data: \n SERVER DIDN'T RESPOND");
      showAdviceToast(
        "You can enable Offline Mode \n in Settings to test the interface",
      );
    }
  }, [loadError, setLoadErrorShown]);
}