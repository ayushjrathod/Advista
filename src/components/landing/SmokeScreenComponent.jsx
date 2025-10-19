import { lazy, memo, Suspense, useEffect, useMemo, useState } from "react";

// Lazy load the heavy SmokeScene component
const SmokeScene = lazy(() => import("react-smoke").then((module) => ({ default: module.SmokeScene })));

const SmokeSceneComponent = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  const smokeColor = useMemo(() => "purple", []);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    // Detect low-end devices
    const isLowEnd =
      navigator.hardwareConcurrency <= 2 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsLowEndDevice(isLowEnd);

    // Use Intersection Observer for lazy loading with longer delay for low-end devices
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay for low-end devices to prevent blocking
          const delay = isLowEnd ? 1000 : 300;
          setTimeout(() => {
            setIsVisible(true);
            observer.disconnect();
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(".smoke-container");
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isLowEndDevice]);

  // Don't render smoke if user prefers reduced motion or on low-end devices
  if (isReducedMotion || isLowEndDevice) {
    return <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10" style={{ zIndex: 0 }} />;
  }

  return (
    <div
      className="fixed inset-0 smoke-container"
      style={{
        zIndex: 0,
      }}
    >
      {isVisible ? (
        <Suspense
          fallback={<div className="w-full h-full bg-gradient-to-br from-purple-900/10 to-blue-900/10 animate-pulse" />}
        >
          <SmokeScene
            smoke={{
              color: smokeColor,
              opacity: 0.4, // Further reduced for better performance
              density: 15, // Further reduced
              enableRotation: true,
              enableWind: true,
              enableTurbulence: false,
              // Additional performance optimizations
              quality: 0.3, // Lower quality for better performance
              particleCount: 50, // Limit particle count
            }}
          />
        </Suspense>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-900/10 to-blue-900/10" />
      )}
    </div>
  );
});

SmokeSceneComponent.displayName = "SmokeSceneComponent";

export default SmokeSceneComponent;
