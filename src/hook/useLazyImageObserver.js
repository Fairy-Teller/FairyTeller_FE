import { useState, useEffect, useRef } from "react";
import base64_Default from "../script/BASE64_Default";

const useLazyImageObserver = (props) => {
  const [imgSrc, setImgSrc] = useState(base64_Default);
  const imgRef = useRef(null);

  useEffect(() => {
    console.log(props.src);
  }, [props.src]);

  useEffect(() => {
    let observer;

    if (imgRef && imgSrc === base64_Default) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setImgSrc(props.src);
            observer.unobserve(imgRef.current);
          }
        },
        { threshold: [0.4] }
      );

      observer.observe(imgRef.current);
    }

    return () => {
      observer && observer.disconnect(imgRef);
    };
  }, [imgRef, imgSrc, props.src]);

  return { imgSrc, imgRef };
};

export default useLazyImageObserver;
