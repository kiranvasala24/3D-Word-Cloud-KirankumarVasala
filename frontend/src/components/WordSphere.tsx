import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { WordData } from "../types";

interface WordSphereProps {
    word : WordData;
    position : [number, number, number];
    color : string;
}

export default function WordSphere({word, position, color }: WordSphereProps) {
    const ref = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    const fontSize = useMemo(() => 0.18 + word.weight * 0.52, [word.weight]);
    const baseOpacity = useMemo(() => 0.55 + word.weight * 0.45, [word.weight]);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.position.y = position[1] + Math.sin(t* 0.4 + position[0]) * 0.06;
        ref.current.scale.setScalar(hovered ? 1.25 : 1.0);
    });

    return (
        <group ref ={ref} position = {position}>
            <Text
            fontSize = {fontSize}
            color = {color}
            anchorX = "center"
            anchorY = "middle"
            fillOpacity = { hovered ? 1 : baseOpacity}
            onPointerOver = {() => setHovered(true)}
            onPointerOut = {() => setHovered(false)}
            >
                {word.word}
            </Text>
        </group>
    );
}