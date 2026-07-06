"use client";

/* Hero 3D — loads the supplied trimmer mesh (FBX + PBR textures from
   /public/models/trimmer) and applies its diffuse/metallic/roughness/normal
   maps. The model is centered and scaled to fit, then stands on a fixed
   vertical axis with a slight tilt, spins slowly on its own, and reacts to the
   pointer (device orientation on phones). Lighting/reflections are
   self-contained via drei Lightformers. Motion always runs. */

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, useFBX } from "@react-three/drei";
import * as THREE from "three";

const RIM_LIGHT = "#ffffff"; // ponytail: monochrome — was hazard orange

/* Orientation fix for the imported model (radians). FBX up-axis / facing can
   differ from three's Y-up; tune here if the trimmer imports lying down. */
const ORIENT: [number, number, number] = [0, 0, 0];
const TARGET_HEIGHT = 3.3;
const DEBUG_FREEZE = false;

function TrimmerModel() {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const aim = useRef({ x: 0, y: 0 });

  /* The PBR variant embeds its textures bound to the correct UVs, so we keep
     the FBX's own materials (a separate atlas + manual UVs did not line up). */
  const fbx = useFBX("/models/trimmer/base_basic_pbr.fbx");

  const model = useMemo(() => {
    const obj = fbx.clone(true);
    obj.traverse((c) => {
      const mesh = c as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          const sm = m as THREE.MeshStandardMaterial;
          if (sm) {
            sm.envMapIntensity = 1.2;
            sm.needsUpdate = true;
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = TARGET_HEIGHT / (Math.max(size.x, size.y, size.z) || 1);
    obj.scale.setScalar(s);
    obj.position.set(-center.x * s, -center.y * s, -center.z * s);
    return obj;
  }, [fbx]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      aim.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      aim.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      aim.current.x = THREE.MathUtils.clamp(e.gamma / 45, -1, 1);
      aim.current.y = THREE.MathUtils.clamp((e.beta - 45) / 45, -1, 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g || DEBUG_FREEZE) return;
    /* slow idle spin about the vertical (Y) axis; pointer nudges pose + lean. */
    spin.current += delta * 0.28;
    const targetY = spin.current + aim.current.x * 0.5;
    const targetX = 0.04 - aim.current.y * 0.18;
    const targetZ = 0.05 + aim.current.x * 0.04;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, 0.07);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.07);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, targetZ, 0.07);
  });

  return (
    <group ref={group} rotation={DEBUG_FREEZE ? [0, 0, 0] : [0.04, 0, 0.05]}>
      <group rotation={ORIENT}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function Rig() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} />
      <directionalLight position={[-3, 2, 3]} intensity={0.8} />
      <pointLight position={[-4, -2, 2]} intensity={8} color={RIM_LIGHT} />

      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.12, 0.12]}>
        <TrimmerModel />
      </Float>

      {/* self-contained reflections — a soft studio strip lights the metal */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} position={[0, 3, 4]} scale={[8, 3, 1]} color="#ffffff" />
        <Lightformer intensity={1.2} position={[-4, 1, 2]} scale={[3, 6, 1]} color="#7a7a8a" />
        <Lightformer intensity={3} position={[3, -1, 1]} scale={[3, 3, 1]} color={RIM_LIGHT} />
      </Environment>
    </>
  );
}

useFBX.preload("/models/trimmer/base_basic_pbr.fbx");

export function Hero3D() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Rig />
      </Suspense>
    </Canvas>
  );
}
