"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./style.module.scss";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import Image from "next/image";

const ANIMATION_CONFIG = {
    transitionSpeed: 0.03,
    baseIntensity: 0.005,
    hoverIntensity: 0.009,
};


interface WaveImageProps {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
}

export default function Landing({
                                      src,
                                      alt = "",
                                      width = 600,
                                      height = 800,
                                  }: WaveImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const img = imgRef.current;
        if (!container || !img) return;

        let animationId: number;

        const camera = new THREE.PerspectiveCamera(
            80,
            img.offsetWidth / img.offsetHeight,
            0.01,
            10
        );
        camera.position.z = 1;

        const scene = new THREE.Scene();

        const current = { x: 0, y: 0, intensity: ANIMATION_CONFIG.baseIntensity };
        const target = { x: 0, y: 0, intensity: ANIMATION_CONFIG.baseIntensity };

        const uniforms = {
            u_time: { value: 1.0 },
            u_mouse: { value: new THREE.Vector2(0, 0) },
            u_intensity: { value: current.intensity },
            u_texture: { value: new THREE.Texture() },
        };

        const planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
        );
        scene.add(planeMesh);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(img.offsetWidth, img.offsetHeight);
        container.appendChild(renderer.domElement);

        new THREE.TextureLoader().load(src, (texture) => {
            uniforms.u_texture.value = texture;
        });

        function lerp(from: number, to: number, speed: number) {
            return from + (to - from) * speed;
        }

        function animate() {
            animationId = requestAnimationFrame(animate);

            current.x = lerp(current.x, target.x, ANIMATION_CONFIG.transitionSpeed);
            current.y = lerp(current.y, target.y, ANIMATION_CONFIG.transitionSpeed);
            current.intensity = lerp(
                current.intensity,
                target.intensity,
                ANIMATION_CONFIG.transitionSpeed
            );

            uniforms.u_intensity.value = current.intensity;
            uniforms.u_time.value += 0.005;
            uniforms.u_mouse.value.set(current.x, current.y);

            renderer.render(scene, camera);
        }

        animate();

        function onMouseMove(e: MouseEvent) {
            const rect = container!.getBoundingClientRect();
            target.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            target.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        }

        function onMouseOver() {
            target.intensity = ANIMATION_CONFIG.hoverIntensity;
        }

        function onMouseOut() {
            target.intensity = ANIMATION_CONFIG.baseIntensity;
            target.x = 0;
            target.y = 0;
        }

        container.addEventListener("mousemove", onMouseMove);
        container.addEventListener("mouseover", onMouseOver);
        container.addEventListener("mouseout", onMouseOut);

        return () => {
            cancelAnimationFrame(animationId);
            container.removeEventListener("mousemove", onMouseMove);
            container.removeEventListener("mouseover", onMouseOver);
            container.removeEventListener("mouseout", onMouseOut);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [src]);

    return (
        <div className={styles.landing}>
            <div
                ref={containerRef}
                className={styles.container}
                style={{ width, height }}
            >
                <Image ref={imgRef} src={src} alt={alt} fill className={styles.image} />
            </div>
        </div>
    );
}
