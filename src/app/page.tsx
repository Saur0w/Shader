"use client";

import WaveImage from "@/components/Landing/index";
import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.main}>
            <WaveImage
                src="/images/midsommar.jpg"
                alt="Midsommar"
                width={400}
                height={600}
            />
            <h1 className={styles.heading}>Midsommar</h1>
        </main>
    );
}
