import useLocalStorage from "./useLocalStorage";

const useAnonUser = () => {
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

export default useAnonUser;
