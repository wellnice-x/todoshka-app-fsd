import { useEffect, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    window.matchMedia("(pointer: coarse)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;