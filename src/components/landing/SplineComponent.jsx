import Spline from "@splinetool/react-spline";
import { Suspense, useEffect, useRef, useState } from "react";

export default function SplineComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="lg:w-[45%] h-[400px] lg:h-[800px] w-full">
      {isVisible && !hasError ? (
        <Suspense
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading 3D scene...</div>
            </div>
          }
        >
          <Spline
            scene="https://prod.spline.design/T4icAyrJcvTFCCah/scene.splinecode"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          />
        </Suspense>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg flex items-center justify-center">
          <div className="text-gray-400 text-sm">{hasError ? "Failed to load 3D scene" : "Loading 3D scene..."}</div>
        </div>
      )}
    </div>
  );
}
