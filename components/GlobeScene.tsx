"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { siteConfig } from "@/data/site";

const GREEN = 0x4ade80;
const WHITE = 0xffffff;
const GLOBE_RADIUS = 2.2;
const TRAIL_LENGTH = 15;

type Point3 = [number, number, number];

function latLngToVector(lat: number, lng: number, radius = GLOBE_RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function makeLineGeometry(points: THREE.Vector3[]) {
  return new THREE.BufferGeometry().setFromPoints(points);
}

function makeLatitudeLine(lat: number) {
  const points: THREE.Vector3[] = [];

  for (let lng = -180; lng <= 180; lng += 4) {
    points.push(latLngToVector(lat, lng, GLOBE_RADIUS * 1.002));
  }

  return makeLineGeometry(points);
}

function makeLongitudeLine(lng: number) {
  const points: THREE.Vector3[] = [];

  for (let lat = -90; lat <= 90; lat += 4) {
    points.push(latLngToVector(lat, lng, GLOBE_RADIUS * 1.002));
  }

  return makeLineGeometry(points);
}

function makeCircleLine(radius: number, segments = 160) {
  const points: THREE.Vector3[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }

  return makeLineGeometry(points);
}

function makeArcLine(start: THREE.Vector3, end: THREE.Vector3) {
  const points: THREE.Vector3[] = [];

  for (let index = 0; index < 40; index += 1) {
    const t = index / 39;
    points.push(start.clone().lerp(end, t).normalize().multiplyScalar(2.25));
  }

  return makeLineGeometry(points);
}

function depthFade(z: number) {
  const normalized = THREE.MathUtils.clamp((z + 3) / 6, 0, 1);

  return {
    opacity: THREE.MathUtils.lerp(0.12, 1, normalized),
    scale: THREE.MathUtils.lerp(0.6, 1, normalized),
  };
}

function LineGeometry({
  geometry,
  opacity,
  renderOrder,
}: {
  geometry: THREE.BufferGeometry;
  opacity: number;
  renderOrder?: number;
}) {
  const line = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity,
      depthWrite: false,
      toneMapped: false,
    });
    const object = new THREE.Line(geometry, material);

    object.renderOrder = renderOrder ?? 0;
    return object;
  }, [geometry, opacity, renderOrder]);

  return <primitive object={line} />;
}

function GridLines() {
  const lines = useMemo(() => {
    const latitudes = [-60, -30, 0, 30, 60];
    const longitudes = Array.from({ length: 12 }, (_, index) => -180 + index * 30);

    return [
      ...latitudes.map((lat) => makeLatitudeLine(lat)),
      ...longitudes.map((lng) => makeLongitudeLine(lng)),
    ];
  }, []);

  return (
    <>
      {lines.map((geometry, index) => (
        <LineGeometry key={index} geometry={geometry} opacity={0.15} />
      ))}
    </>
  );
}

function Atmosphere() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[2.35, 48, 48]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.205, 2.215, 120]} />
        <meshBasicMaterial
          color={GREEN}
          transparent
          opacity={0.1}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

function OuterGlowRing() {
  const geometry = useMemo(() => makeCircleLine(2.45), []);

  return <LineGeometry geometry={geometry} opacity={0.3} renderOrder={3} />;
}

function BeaconRing({ delay }: { delay: number }) {
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ring.current) {
      return;
    }

    const progress = (clock.getElapsedTime() * 0.8 + delay) % 1;
    const material = ring.current.material as THREE.MeshBasicMaterial;

    ring.current.scale.setScalar(1 + progress * 2);
    material.opacity = 0.7 * (1 - progress);
  });

  return (
    <mesh ref={ring}>
      <ringGeometry args={[0.08, 0.095, 48]} />
      <meshBasicMaterial
        color={GREEN}
        transparent
        opacity={0.7}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function Beacon() {
  const position = useMemo(
    () => latLngToVector(siteConfig.globe.isb.lat, siteConfig.globe.isb.lng, GLOBE_RADIUS * 1.02),
    [],
  );
  const orientation = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  );

  return (
    <group position={position.toArray() as Point3} quaternion={orientation}>
      <mesh>
        <sphereGeometry args={[0.05, 24, 24]} />
        <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <BeaconRing delay={0} />
      <BeaconRing delay={0.33} />
      <BeaconRing delay={0.66} />
    </group>
  );
}

function ArcLines() {
  const arcs = useMemo(() => {
    const start = latLngToVector(siteConfig.globe.isb.lat, siteConfig.globe.isb.lng);

    return siteConfig.globe.nodes.map((node) => makeArcLine(start, latLngToVector(node.lat, node.lng)));
  }, []);

  return (
    <>
      {arcs.map((geometry, index) => (
        <LineGeometry key={index} geometry={geometry} opacity={0.3} />
      ))}
    </>
  );
}

function OrbitRing({ radius, color, tilt = 0 }: { radius: number; color: number; tilt?: number }) {
  const line = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(64).map((point) => {
      const position = new THREE.Vector3(point.x, 0, point.y);
      position.applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
      return position;
    });
    const geometry = makeLineGeometry(points);
    const material = new THREE.LineDashedMaterial({
      color,
      transparent: true,
      opacity: 0.08,
      dashSize: 0.15,
      gapSize: 0.1,
      depthWrite: false,
      toneMapped: false,
    });
    const object = new THREE.Line(geometry, material);

    object.computeLineDistances();
    return object;
  }, [color, radius, tilt]);

  return <primitive object={line} />;
}

function Satellite({
  radius,
  speed,
  tilt = 0,
  phase = 0,
}: {
  radius: number;
  speed: number;
  tilt?: number;
  phase?: number;
}) {
  const satellite = useRef<THREE.Mesh>(null);
  const trail = useRef<THREE.Points[]>([]);
  const positions = useRef<THREE.Vector3[]>([]);

  const getPosition = (time: number) => {
    const point = new THREE.Vector3(Math.cos(time) * radius, 0, Math.sin(time) * radius);
    point.applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
    return point;
  };

  useFrame(({ clock }) => {
    const current = getPosition(clock.getElapsedTime() * speed + phase);

    positions.current.unshift(current);
    positions.current = positions.current.slice(0, TRAIL_LENGTH);

    if (satellite.current) {
      satellite.current.position.copy(current);
      const satelliteMaterial = satellite.current.material as THREE.MeshBasicMaterial;
      const fade = depthFade(current.z);

      satelliteMaterial.opacity = fade.opacity;
      satellite.current.scale.setScalar(fade.scale);
    }

    trail.current.forEach((point, index) => {
      const position = positions.current[index] ?? current;
      const attribute = point.geometry.getAttribute("position") as THREE.BufferAttribute;
      const material = point.material as THREE.PointsMaterial;
      const fade = depthFade(position.z);

      attribute.setXYZ(0, position.x, position.y, position.z);
      attribute.needsUpdate = true;
      material.opacity = fade.opacity * (1 - index / TRAIL_LENGTH);
    });
  });

  return (
    <>
      <mesh ref={satellite}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={WHITE} transparent opacity={1} toneMapped={false} />
      </mesh>
      {Array.from({ length: TRAIL_LENGTH }, (_, index) => (
        <points
          key={index}
          ref={(point) => {
            if (point) {
              trail.current[index] = point;
            }
          }}
        >
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[new Float32Array(3), 3]} />
          </bufferGeometry>
          <pointsMaterial
            color={WHITE}
            size={0.025}
            transparent
            opacity={0.35 * (1 - index / TRAIL_LENGTH)}
            depthWrite={false}
            toneMapped={false}
          />
        </points>
      ))}
    </>
  );
}

function Globe() {
  const globe = useRef<THREE.Group>(null);

  useFrame(() => {
    if (globe.current) {
      globe.current.rotation.y += 0.003;
    }
  });

  return (
    <>
      <group ref={globe}>
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <Atmosphere />
        <GridLines />
        <OuterGlowRing />
        <Beacon />
        <ArcLines />
      </group>
      <OrbitRing radius={2.6} color={WHITE} />
      <OrbitRing radius={2.8} color={WHITE} tilt={Math.PI / 4} />
      <Satellite radius={2.6} speed={0.4} />
      <Satellite radius={2.8} speed={0.3} tilt={Math.PI / 4} phase={Math.PI} />
    </>
  );
}

export default function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <Globe />
    </Canvas>
  );
}
