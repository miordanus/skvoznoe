"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import styles from "./hero-scene.module.css";
import type { SceneLayer } from "./sceneConfig";
import { PARALLAX_SPEED } from "./sceneConfig";

type ParallaxObjectProps = {
  src: string;
  alt: string;
  layer: SceneLayer;
  top: string;
  left: string;
  width: number;
  rotate: number;
  z: number;
  floatAmplitude: number;
  floatDuration: number;
  floatDelay: number;
  scrollY: number;
  reducedMotion: boolean;
  mobileTop?: string;
  mobileLeft?: string;
  mobileWidth?: number;
  mobileHidden?: boolean;
};

export default function ParallaxObject({
  src,
  alt,
  layer,
  top,
  left,
  width,
  rotate,
  z,
  floatAmplitude,
  floatDuration,
  floatDelay,
  scrollY,
  reducedMotion,
  mobileTop,
  mobileLeft,
  mobileWidth,
  mobileHidden,
}: ParallaxObjectProps) {
  const parallaxY = reducedMotion ? 0 : scrollY * PARALLAX_SPEED[layer];

  const style = {
    top,
    left,
    width: `${width}px`,
    zIndex: z,
    transform: `translate3d(0, ${parallaxY}px, 0) rotate(${rotate}deg)`,
    ["--base-rotate" as string]: `${rotate}deg`,
    ["--float-amplitude" as string]: `${reducedMotion ? 0 : floatAmplitude}px`,
    ["--float-duration" as string]: `${floatDuration}s`,
    ["--float-delay" as string]: `${floatDelay}s`,
    ["--mobile-top" as string]: mobileTop ?? top,
    ["--mobile-left" as string]: mobileLeft ?? left,
    ["--mobile-width" as string]: `${mobileWidth ?? width}px`,
  } as CSSProperties;

  const className = [
    styles.object,
    styles[`layer_${layer}`],
    reducedMotion ? styles.reducedMotion : "",
    mobileHidden ? styles.mobileHidden : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} style={style} aria-hidden="true">
      <div className={styles.floatWrap}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={width}
          className={styles.image}
          priority={z >= 3}
          unoptimized
        />
      </div>
    </div>
  );
}
