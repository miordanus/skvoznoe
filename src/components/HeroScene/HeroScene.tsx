"use client";

import { useEffect, useState } from "react";
import ParallaxObject from "./ParallaxObject";
import { sceneObjects } from "./sceneConfig";
import styles from "./hero-scene.module.css";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);

    onChange();
    media.addEventListener?.("change", onChange);

    return () => media.removeEventListener?.("change", onChange);
  }, []);

  return reducedMotion;
}

function useScrollY(enabled: boolean) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY || 0);
        raf = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return scrollY;
}

export default function HeroScene() {
  const reducedMotion = useReducedMotion();
  const scrollY = useScrollY(!reducedMotion);

  return (
    <section className={styles.hero}>
      <div className={styles.scene}>
        {sceneObjects.map((item) => (
          <ParallaxObject
            key={item.src}
            src={item.src}
            alt={item.alt}
            layer={item.layer}
            top={item.top}
            left={item.left}
            width={item.width}
            rotate={item.rotate}
            z={item.z}
            floatAmplitude={item.floatAmplitude}
            floatDuration={item.floatDuration}
            floatDelay={item.floatDelay}
            scrollY={scrollY}
            reducedMotion={reducedMotion}
            mobileTop={item.mobile?.top}
            mobileLeft={item.mobile?.left}
            mobileWidth={item.mobile?.width}
            mobileHidden={item.mobile?.hidden}
          />
        ))}

        <div className={styles.content}>
          <p className={styles.kicker}>strange old internet</p>
          <h1 className={styles.title}>skvoznoe</h1>
          <p className={styles.subtitle}>
            surreal engraving collage, slow drift, no startup perfume
          </p>
          <a href="#enter" className={styles.cta}>
            enter
          </a>
        </div>
      </div>
    </section>
  );
}
