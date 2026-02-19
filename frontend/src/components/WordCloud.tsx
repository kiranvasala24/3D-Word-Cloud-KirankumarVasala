import { useRef, useMemo } from "react";
import { useFrame, RootState } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { WordData } from "../types";
import WordSphere from "./WordSphere";

interface WordCloudProps {
    words : WordData[];
}

const PALETTE = [
    "#6c63ff", "#3ecfcf", "#ff6b9d", "#ffd166",
    "#06d6a0", "#ef476f", "#a8dadc", "#f4a261",
    "#e9c46a", "#9b5de5", "#f15bb5", "#00bbf9",
];

function fibonacciSphere(count: number, radius: number): [number, number, number][] {
    const positions : [number, number, number] [] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        positions.push([
            Math.cos(theta) * r * radius,
            y * radius,
            Math.sin(theta) * r * radius,
        ]);
    }
    return positions;
}

export default function WordCloud ({ words} : WordCloudProps) {
    const groupRef = useRef<THREE.Group>(null);

    const radius = useMemo(() => {
        const base =  3.5;
        const scale = Math.sqrt(words.length / 30);
        return base + scale * 1.2;
    },
    [words.length]
    );

    const positions = useMemo(() => fibonacciSphere(words.length, radius), [words.length, radius]);

    const colors = useMemo(
        () => words.map((_, i) => PALETTE[i % PALETTE.length]),
        [words]
    );

    useFrame((_state: RootState, delta: number) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.08;
        }
    });
    return (
         <>
      <OrbitControls enableZoom enablePan={false} autoRotate={false} />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <group ref={groupRef}>
        {words.map((w, i) => (
          <WordSphere
            key={w.word}
            word={w}
            position={positions[i]}
            color={colors[i]}
          />
        ))}
      </group>
    </>
  );
}

