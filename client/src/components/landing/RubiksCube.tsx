import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useRef, useEffect, useMemo, useState, type RefObject } from "react";
import * as THREE from "three";
import { Environment } from "@react-three/drei";
import { Easing, Tween, Group as TweenGroup } from "@tweenjs/tween.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    __ADVISTA_CUBE_IS_TURNING__?: boolean;
    __ADVISTA_CUBE_CANVAS_READY__?: boolean;
  }
}

RectAreaLightUniformsLib.init();

// Reusable matrix/quaternion objects to avoid GC pressure in render loop
const _tempMatrix = new THREE.Matrix4();
const _tempMatrix2 = new THREE.Matrix4();
const _rotMatrix = new THREE.Matrix4();
const _position = new THREE.Vector3();

const CUBES_PER_SIDE = 3;
const TURN_AMOUNT = Math.PI;
const QUARTER_TURN = Math.PI / 2;
const HALF_TURN = Math.PI;
const BASE_LOOP_DURATION_MS = 8000;

type LayerRotation = { x: number };

const LOOP_TURN_EVENTS = [
  { layerIndex: 0, startMs: 450, durationMs: 850, from: 0, to: QUARTER_TURN },
  { layerIndex: 0, startMs: 1300, durationMs: 850, from: QUARTER_TURN, to: 0 },
  { layerIndex: 2, startMs: 2700, durationMs: 850, from: 0, to: -QUARTER_TURN },
  { layerIndex: 2, startMs: 3550, durationMs: 850, from: -QUARTER_TURN, to: 0 },
  { layerIndex: 1, startMs: 5000, durationMs: 900, from: 0, to: HALF_TURN },
  { layerIndex: 1, startMs: 5900, durationMs: 900, from: HALF_TURN, to: 0 },
];

function setCubeTurningState(isTurning: boolean) {
  if (typeof window !== "undefined") {
    window.__ADVISTA_CUBE_IS_TURNING__ = isTurning;
  }
}

function randomDirection() {
  return Math.random() > 0.5 ? 1 : -1;
}

function randomLayerIndex() {
  return Math.floor(Math.random() * CUBES_PER_SIDE);
}

function randomTurnAmount() {
  return Math.random() > 0.35 ? QUARTER_TURN : HALF_TURN;
}

function toRadians(angle: number) {
  return angle * (Math.PI / 180);
}

function easeInOutQuad(progress: number) {
  return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

function scaleLoopTime(timeMs: number, loopDurationMs: number) {
  return (timeMs / BASE_LOOP_DURATION_MS) * loopDurationMs;
}

function getLoopLayerRotation(phaseMs: number, layerIndex: number, loopDurationMs: number) {
  const events = LOOP_TURN_EVENTS.filter((event) => event.layerIndex === layerIndex);
  let rotation = 0;

  for (const event of events) {
    const startMs = scaleLoopTime(event.startMs, loopDurationMs);
    const durationMs = scaleLoopTime(event.durationMs, loopDurationMs);

    if (phaseMs < startMs) {
      break;
    }

    const endMs = startMs + durationMs;

    if (phaseMs <= endMs) {
      const progress = (phaseMs - startMs) / durationMs;
      return event.from + (event.to - event.from) * easeInOutQuad(progress);
    }

    rotation = event.to;
  }

  return rotation;
}

function isLoopTurnActive(phaseMs: number, loopDurationMs: number) {
  return LOOP_TURN_EVENTS.some((event) => {
    const startMs = scaleLoopTime(event.startMs, loopDurationMs);
    const endMs = startMs + scaleLoopTime(event.durationMs, loopDurationMs);
    return phaseMs >= startMs && phaseMs <= endMs;
  });
}

function createRoundedBoxGeometry() {
  // Reduced smoothness from 8→4 for ~4x fewer triangles with negligible visual difference
  const width = 1, height = 1, depth = 1, radius0 = 0.09, smoothness = 4;
  const shape = new THREE.Shape();
  const eps = 0.00001;
  const radius = radius0 - eps;
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
  shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true);
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness,
  });
  geometry.center();
  return geometry;
}

function rotateCubeOrientation(cubesGroup: THREE.Group) {
  if (Math.random() > 0.5) {
    cubesGroup.rotateY(Math.PI / 2);
  } else {
    cubesGroup.rotateZ(Math.PI / 2);
  }
}

function buildTurnPattern() {
  const direction = randomDirection();
  const oppositeDirection = direction * -1;
  const leadingIndex = Math.random() > 0.5 ? 0 : 1;
  const randomLayer = randomLayerIndex();
  const quarterTurn = QUARTER_TURN;
  const mixedTurn = randomTurnAmount();
  const oppositeMixedTurn = mixedTurn === QUARTER_TURN ? HALF_TURN : QUARTER_TURN;

  const patterns = [
    {
      duration: 1800,
      cooldown: 500,
      moves: [{ layerIndex: randomLayer, direction, amount: mixedTurn, delay: 0 }],
    },
    {
      duration: 1900,
      cooldown: 650,
      moves: [
        { layerIndex: 0, direction, amount: mixedTurn, delay: 0 },
        { layerIndex: 2, direction, amount: mixedTurn, delay: 0 },
      ],
    },
    {
      duration: 1900,
      cooldown: 650,
      moves: [
        { layerIndex: 0, direction, amount: mixedTurn, delay: 0 },
        { layerIndex: 2, direction: oppositeDirection, amount: mixedTurn, delay: 0 },
      ],
    },
    {
      duration: 1650,
      cooldown: 600,
      moves: [
        { layerIndex: leadingIndex, direction, amount: quarterTurn, delay: 0 },
        { layerIndex: leadingIndex + 1, direction, amount: quarterTurn, delay: 180 },
      ],
    },
    {
      duration: 1700,
      cooldown: 700,
      moves: [
        { layerIndex: 0, direction, amount: quarterTurn, delay: 0 },
        { layerIndex: 1, direction: oppositeDirection, amount: mixedTurn, delay: 140 },
        { layerIndex: 2, direction, amount: quarterTurn, delay: 280 },
      ],
    },
    {
      duration: 1600,
      cooldown: 650,
      moves: [
        { layerIndex: 0, direction, amount: quarterTurn, delay: 0 },
        { layerIndex: 1, direction, amount: quarterTurn, delay: 140 },
        { layerIndex: 2, direction, amount: quarterTurn, delay: 280 },
      ],
    },
    {
      duration: 1500,
      cooldown: 600,
      moves: [
        { layerIndex: 1, direction, amount: HALF_TURN, delay: 0 },
        { layerIndex: 0, direction: oppositeDirection, amount: quarterTurn, delay: 120 },
        { layerIndex: 2, direction: oppositeDirection, amount: quarterTurn, delay: 120 },
      ],
    },
    {
      duration: 1450,
      cooldown: 600,
      moves: [
        { layerIndex: randomLayer, direction, amount: quarterTurn, delay: 0 },
        { layerIndex: randomLayer, direction: oppositeDirection, amount: quarterTurn, delay: 720 },
      ],
    },
    {
      duration: 1750,
      cooldown: 720,
      moves: [
        { layerIndex: 0, direction, amount: quarterTurn, delay: 0 },
        { layerIndex: 2, direction, amount: HALF_TURN, delay: 160 },
        { layerIndex: 1, direction: oppositeDirection, amount: oppositeMixedTurn, delay: 360 },
      ],
    },
    {
      duration: 1550,
      cooldown: 680,
      moves: [
        { layerIndex: 0, direction, amount: quarterTurn, delay: 0 },
        { layerIndex: 2, direction: oppositeDirection, amount: quarterTurn, delay: 0 },
        { layerIndex: 1, direction, amount: quarterTurn, delay: 260 },
      ],
    },
  ];

  return patterns[Math.floor(Math.random() * patterns.length)];
}

function scheduleTurnPattern(
  layerRotations: LayerRotation[],
  orientationGroupRef: RefObject<THREE.Group | null>,
  tweenGroup: TweenGroup,
  timeouts: number[]
) {
  if (!orientationGroupRef.current) {
    setCubeTurningState(false);
    return;
  }

  rotateCubeOrientation(orientationGroupRef.current);

  const pattern = buildTurnPattern();
  const validMoves = pattern.moves.filter(({ layerIndex }) => layerIndex < CUBES_PER_SIDE);

  if (!validMoves.length) {
    setCubeTurningState(false);
    return;
  }

  let pendingMoves = validMoves.length;
  setCubeTurningState(true);

  validMoves.forEach(({ layerIndex, direction, amount = TURN_AMOUNT, delay }) => {
    const target = layerRotations[layerIndex];

    new Tween(target, tweenGroup)
      .delay(delay)
      .to(
        { x: target.x + amount * direction },
        pattern.duration
      )
      .easing(Easing.Quadratic.InOut)
      .onComplete(() => {
        pendingMoves -= 1;

        if (pendingMoves === 0) {
          setCubeTurningState(false);
          const nextDelay = pattern.cooldown + Math.random() * 450;
          const timeoutId = window.setTimeout(() => scheduleTurnPattern(layerRotations, orientationGroupRef, tweenGroup, timeouts), nextDelay);
          timeouts.push(timeoutId);
        }
      })
      .start();
  });
}

type CubeSceneContentsProps = {
  outerRef: RefObject<THREE.Group | null>;
  sceneScale?: number;
  loopMode?: boolean;
  loopDurationMs?: number;
  loopStartDelayMs?: number;
};

const CubeSceneContents = memo(function CubeSceneContents({
  outerRef,
  sceneScale = 1,
  loopMode = false,
  loopDurationMs = 8000,
  loopStartDelayMs = 0,
}: CubeSceneContentsProps) {
  const innerRef = useRef<THREE.Group>(null);
  const orientationGroupRef = useRef<THREE.Group>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const keyLightRef = useRef<THREE.RectAreaLight>(null);
  const fillLightRef = useRef<THREE.RectAreaLight>(null);
  const tweenGroupRef = useRef(new TweenGroup());
  const timeoutsRef = useRef<number[]>([]);
  const loopStartTimeRef = useRef<number | null>(null);

  // Per-layer rotation targets for tween animation
  const layerRotationsRef = useRef<LayerRotation[]>([{ x: 0 }, { x: 0 }, { x: 0 }]);

  const geometry = useMemo(() => createRoundedBoxGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 1.0,
        roughness: 0.07,
      }),
    []
  );

  // Precompute base positions and layer assignments for all 27 cubes
  const { baseMatrices, layerMap } = useMemo(() => {
    const offset = (CUBES_PER_SIDE - 1) / 2;
    const matrices: THREE.Matrix4[] = [];
    const lMap: number[] = [];
    for (let i = 0; i < CUBES_PER_SIDE; i++) {
      for (let j = 0; j < CUBES_PER_SIDE; j++) {
        for (let k = 0; k < CUBES_PER_SIDE; k++) {
          const m = new THREE.Matrix4();
          m.setPosition(
            (i - offset) * 1.03,
            (j - offset) * 1.03,
            (k - offset) * 1.03
          );
          matrices.push(m);
          lMap.push(i); // layer index = first axis
        }
      }
    }
    return { baseMatrices: matrices, layerMap: lMap };
  }, []);

  const instanceCount = CUBES_PER_SIDE * CUBES_PER_SIDE * CUBES_PER_SIDE; // 27

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useEffect(() => {
    const keyLight = keyLightRef.current;
    const fillLight = fillLightRef.current;
    const tweenGroup = tweenGroupRef.current;
    const timeouts = timeoutsRef.current;

    if (keyLight) keyLight.lookAt(0, 0, 0);
    if (fillLight) fillLight.lookAt(0, 0, 0);

    if (loopMode) return;
    scheduleTurnPattern(layerRotationsRef.current, orientationGroupRef, tweenGroup, timeouts);
    return () => {
      setCubeTurningState(false);
      tweenGroup.removeAll();
      timeouts.forEach(clearTimeout);
      timeouts.length = 0;
    };
  }, [loopMode]);

  useFrame((state) => {
    const layerRots = layerRotationsRef.current;

    if (loopMode) {
      if (loopStartTimeRef.current == null) {
        loopStartTimeRef.current = state.clock.elapsedTime * 1000;
      }

      const elapsedMs = state.clock.elapsedTime * 1000 - loopStartTimeRef.current - loopStartDelayMs;
      const isWarmup = elapsedMs < 0;
      const phaseMs = isWarmup ? 0 : elapsedMs % loopDurationMs;
      const angle = (phaseMs / loopDurationMs) * Math.PI * 2;

      if (outerRef.current) {
        outerRef.current.rotation.x = Math.sin(angle) * 0.18;
        outerRef.current.rotation.y = angle;
        outerRef.current.rotation.z = Math.cos(angle) * 0.12;
      }

      if (innerRef.current) {
        innerRef.current.rotation.x = Math.sin(angle * 2) * 0.08;
        innerRef.current.rotation.y = Math.cos(angle) * 0.06;
        innerRef.current.rotation.z = Math.sin(angle) * 0.05;
      }

      // Update layer rotations for loop mode
      for (let l = 0; l < CUBES_PER_SIDE; l++) {
        layerRots[l].x = isWarmup ? 0 : getLoopLayerRotation(phaseMs, l, loopDurationMs);
      }

      setCubeTurningState(!isWarmup && isLoopTurnActive(phaseMs, loopDurationMs));
    } else {
      if (innerRef.current) {
        innerRef.current.rotation.x += 0.005;
        innerRef.current.rotation.y += 0.005;
        innerRef.current.rotation.z += 0.005;
      }
      tweenGroupRef.current.update();
    }

    // Update all 27 instance matrices in a single pass (1 draw call instead of 27)
    const mesh = instancedMeshRef.current;
    if (!mesh) return;

    for (let i = 0; i < instanceCount; i++) {
      const layerIdx = layerMap[i];
      const rot = layerRots[layerIdx].x;

      if (rot !== 0) {
        _rotMatrix.makeRotationX(rot);
        _tempMatrix.copy(baseMatrices[i]);
        // Extract position, apply layer rotation, recombine
        _position.setFromMatrixPosition(_tempMatrix);
        _position.applyMatrix4(_rotMatrix);
        _tempMatrix2.copy(_rotMatrix);
        _tempMatrix2.setPosition(_position);
        mesh.setMatrixAt(i, _tempMatrix2);
      } else {
        mesh.setMatrixAt(i, baseMatrices[i]);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <rectAreaLight ref={keyLightRef} intensity={35} width={20} height={20} position={[8, 12, 5]} />
      <rectAreaLight ref={fillLightRef} intensity={22} width={20} height={20} position={[-6, -8, 5]} />
      <ambientLight intensity={0.05} />
      <Environment preset="studio" background={false} />
      <group ref={outerRef} scale={sceneScale}>
        <group ref={innerRef}>
          <group ref={orientationGroupRef}>
            <instancedMesh
              ref={instancedMeshRef}
              args={[geometry, material, instanceCount]}
              frustumCulled={false}
            />
          </group>
        </group>
      </group>
    </>
  );
});

type RubiksCubeSceneProps = {
  className?: string;
  forceVisible?: boolean;
  interactive?: boolean;
  mobileBreakpoint?: number;
  onSceneReady?: () => void;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  sceneScale?: number;
  loopMode?: boolean;
  loopDurationMs?: number;
  loopStartDelayMs?: number;
};

export default function RubiksCubeScene({
  className,
  forceVisible = false,
  interactive = true,
  mobileBreakpoint = 1024,
  onSceneReady,
  cameraPosition = [0, 0, 6],
  cameraFov = 75,
  sceneScale = 1,
  loopMode = false,
  loopDurationMs = 8000,
  loopStartDelayMs = 0,
}: RubiksCubeSceneProps) {
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < mobileBreakpoint : false
  );
  const [isGrabbing, setIsGrabbing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<THREE.Group>(null);
  const dragRef = useRef({ isDragging: false, prevX: 0, prevY: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < mobileBreakpoint);
    window.addEventListener("resize", checkMobile);

    if (forceVisible) {
      setIsVisible(true);

      return () => {
        window.removeEventListener("resize", checkMobile);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, [forceVisible, mobileBreakpoint]);

  useEffect(() => {
    if (isVisible && onSceneReady) {
      onSceneReady();
    }
  }, [isVisible, onSceneReady]);

  if (isMobile) return null;

  function handlePointerDown(e: any) {
    dragRef.current.isDragging = true;
    setIsGrabbing(true);
    const src = e.touches ? e.touches[0] : e;
    dragRef.current.prevX = src.clientX;
    dragRef.current.prevY = src.clientY;
  }

  function handlePointerMove(e: any) {
    if (!dragRef.current.isDragging || !outerRef.current) return;
    const src = e.touches ? e.touches[0] : e;
    const sensitivity = e.touches ? 0.5 : 1.0;
    const dx = src.clientX - dragRef.current.prevX;
    const dy = src.clientY - dragRef.current.prevY;
    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(toRadians(dy * sensitivity), toRadians(dx * sensitivity), 0, "XYZ")
    );
    outerRef.current.quaternion.multiplyQuaternions(q, outerRef.current.quaternion);
    dragRef.current.prevX = src.clientX;
    dragRef.current.prevY = src.clientY;
  }

  function handlePointerUp() {
    dragRef.current.isDragging = false;
    setIsGrabbing(false);
  }

  return (
    <div
      ref={containerRef}
      className={cn("h-[360px] w-full relative overflow-hidden lg:h-[680px] lg:w-[40%]", className)}
      style={{ cursor: interactive ? (isGrabbing ? "grabbing" : "grab") : "default" }}
      onMouseDown={interactive ? handlePointerDown : undefined}
      onMouseMove={interactive ? handlePointerMove : undefined}
      onMouseUp={interactive ? handlePointerUp : undefined}
      onMouseLeave={interactive ? handlePointerUp : undefined}
      onTouchStart={interactive ? handlePointerDown : undefined}
      onTouchMove={interactive ? handlePointerMove : undefined}
      onTouchEnd={interactive ? handlePointerUp : undefined}
    >
      {isVisible && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ fov: cameraFov, near: 0.1, far: 1000, position: cameraPosition }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            // Reinhard is gentler than ACESFilmic (R3F default) — prevents
            // the over-aggressive contrast that crushes darks and clips highlights
            toneMapping: THREE.ReinhardToneMapping,
            toneMappingExposure: 0.85,
          }}
          style={{ position: "relative", zIndex: 1 }}
          onCreated={() => {
            if (typeof window !== "undefined") {
              window.__ADVISTA_CUBE_CANVAS_READY__ = true;
              window.__ADVISTA_CUBE_IS_TURNING__ = false;
            }
          }}
        >
          <CubeSceneContents
            outerRef={outerRef}
            sceneScale={sceneScale}
            loopMode={loopMode}
            loopDurationMs={loopDurationMs}
            loopStartDelayMs={loopStartDelayMs}
          />
        </Canvas>
      )}
    </div>
  );
}
