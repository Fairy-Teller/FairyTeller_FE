import React, { memo } from "react";
import useLazyImageObserver from "../../hook/useLazyImageObserver";

const LazyImage = memo(({ className, src, alt }) => {
  const { imgSrc, imgRef } = useLazyImageObserver({ src });

  return (
    <img
      className={className}
      ref={imgRef}
      src={imgSrc}
      alt={alt}
    />
  );
});

export default LazyImage;
