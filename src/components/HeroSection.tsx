"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Text Stagger Reveal Animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5 }
    )
      .fromTo(
        textRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        buttonsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
      );
  }, []);

  return (
    <section className="hero-section">
      {/* Background video with dark cinematic overlay */}
      <video
        id="heroVideo"
        className="hero-bg video-bg"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/static/images/intro.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>

      {/* Content anchored to bottom-left */}
      <div id="heroContent" className="hero-content is-visible">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-xl-6">
              <span className="hero-eyebrow">Premium Menswear — New Season</span>
              <h1 className="hero-title" ref={titleRef}>
                Dress With<br />
                <em>Intention.</em>
              </h1>
              <p className="hero-description" ref={textRef}>
                Curated collections from the world's finest houses. Experience
                luxury fashion, redefined for the discerning man.
              </p>
              <div className="hero-buttons" ref={buttonsRef}>
                <Link href="/categories" className="btn-primary-luxury">
                  Explore Collection
                </Link>
                <Link href="/new-arrivals" className="btn-outline-luxury">
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <span className="scroll-line"></span>
      </div>
    </section>
  );
}
