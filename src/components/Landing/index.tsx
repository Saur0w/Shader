"use client";

import styles from "./style.module.scss";
import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useMouseVelocity } from "@/hooks/useMousePosition";


export default function Landing() {
    const containerRef = useRef<HTMLDivElement>(null!);
    const { mouse, velocity } = useMouseVelocity(containerRef);

    return (
        <div ref={containerRef} className={styles.container}>
            <Canvas camera={{ position: [0, 0, 1.5], fov: 60 }}>
                <Suspense fallback={null}>

                </Suspense>
            </Canvas>
        </div>
    );
}