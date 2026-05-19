import useLocalStorage from "@/shared/lib/storage/useLocalStorage";

export const useAnonUser = () => {
  const [userNickname, setUserNickname] = useLocalStorage<string>(
    "userNickname",
    "",
  );

  const hasUserName = !!userNickname;

  return {
    userNickname,
    setUserNickname,
    hasUserName,
  };
};
