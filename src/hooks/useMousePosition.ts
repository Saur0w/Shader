"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";

export function useMouseVelocity(ref: React.RefObject<HTMLDivElement>) {
    const mouse = useRef({ x: 0.5, y: 0.5 });
    const velocity = useRef({ x: 0, y: 0 });
    const prev = useRef({ x: 0.5, y: 0.5 });

    useGSAP(() => {
        const el = ref.current;
        if (!el) return;

        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height;

            gsap.to(mouse.current, {
                x,
                y,
                duration: 0.5,
                ease: "power2.out"
            });

            velocity.current.x = x - prev.current.x;
            velocity.current.y = y - prev.current.y;
            prev.current = { x, y };
        };

        el.addEventListener("mousemove", onMove);
        return () => el.removeEventListener("mousemove", onMove);
    }, [ref]);

    return { mouse, velocity };
}