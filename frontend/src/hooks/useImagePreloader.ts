import { useState, useEffect } from "react";

export function useImagePreloader(src: string) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!src) {
      setIsLoaded(true);
      return;
    }

    const img = new Image();
    img.src = src;

    img.decode()
      .then(() => {
        if (isMounted) setIsLoaded(true);
      })
      .catch((e) => {
        // Fallback or error, still show the page
        console.warn("Could not decode image:", src, e);
        if (isMounted) setIsLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return isLoaded;
}
