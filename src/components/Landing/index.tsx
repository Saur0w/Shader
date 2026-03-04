"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./style.module.scss";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import Image from "next/image";

const ANIMATION_CONFIG = {
    transitionSpeed: 0.03,
    baseIntensity: 0.005,
    hoverIntensity: 0.009,
} as const;

interface WaveImageProps {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
}

export default function Landing({src, alt = "", width = 600, height = 800}: WaveImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    return (
        <div className={styles.landing}>
            <div className={styles.container} ref={containerRef}>
                <Image src={src} alt={alt} width={width} height={height} />
            </div>
        </div>
    );
}