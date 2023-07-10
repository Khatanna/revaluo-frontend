import { useRef, useEffect, useState } from "react";

const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && imgRef.current) {
          imgRef.current.src = src;
          observer.unobserve(imgRef.current);
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <img
        style={isLoading ? { border: "1px solid gray", borderRadius: 5 } : {}}
        ref={imgRef}
        alt={alt}
        loading="lazy"
        width={60}
        height={60}
        className="img-fluid"
        onLoad={handleImageLoad}
      />
    </>
  );
};

export default LazyImage;
