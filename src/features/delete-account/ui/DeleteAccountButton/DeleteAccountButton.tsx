import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import { useDeleteAccount } from "@/features/delete-account";
import { useServerAccessState } from "@/shared/model/access/useServerAccessState";
import DeleteProfileIcon from "@/shared/assets/icons/delete-profile-icon.svg?react";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import styles from "./DeleteAccountButton.module.scss";

type ModalAction = "deleteConfirm" | "deleteForce" | null;

type DeleteAccountButtonProps = {
  className?: string;
};

const DeleteAccountButton = ({ className }: DeleteAccountButtonProps) => {
  const [modalAction, setModalAction] = useState<ModalAction>(null);

  const { canAccessServer } = useServerAccessState();

  const { deleteAllData, deleteLocalUserData, isDataDeleting } =
    useDeleteAccount();

  const navigate = useNavigate();

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

    const result = await deleteAllData();

    if (result.status === "success") {
      navigate("/auth");
    }

    if (result.status === "failed") {
      setModalAction("deleteForce");
    }
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
    <>
      <button
        className={`${styles.button} ${className ?? ""}`}
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
    </>
  );
};

export default DeleteAccountButton;
