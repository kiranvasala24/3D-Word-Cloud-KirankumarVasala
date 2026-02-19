import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { WordData } from "../types";

interface WordSphereProps {
    word: WordData;
    position: [number, number, number];
    color: string;
}

export default function WordSphere({ word, position, color }: WordSphereProps) {
    const ref = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    const fontSize = useMemo(() => 0.18 + word.weight * 0.52, [word.weight]);
    const baseOpacity = useMemo(() => 0.55 + word.weight * 0.45, [word.weight]);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;

        ref.current.position.y = position[1] + Math.sin(t * 0.4 + position[0]) * 0.08;

        const pulse = 1 + Math.sin(t * 1.5) * (word.weight * 0.03);
        const targetScale = hovered ? 1.35 : pulse;

        ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <group
            ref={ref}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <Text
                fontSize={fontSize}
                color={hovered ? "#fff" : color}
                anchorX="center"
                anchorY="middle"
                fillOpacity={hovered ? 1 : baseOpacity}
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
            >
                {word.word}
            </Text>
        </group>
    );
}