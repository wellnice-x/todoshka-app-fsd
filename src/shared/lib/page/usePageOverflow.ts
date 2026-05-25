import { useLayoutEffect, useState } from "react";

export const usePageOverflow = () => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const checkOverflow = () => {
      setIsOverflowing(
        document.documentElement.scrollHeight > window.innerHeight,
      );
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);

    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, []);

  return isOverflowing;
};