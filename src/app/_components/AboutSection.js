"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(imageRef.current, {
        x: -100,
        opacity: 0,
        rotation: -8,
      });

      gsap.set(titleRef.current, {
        x: 100,
        opacity: 0,
      });

      gsap.set(subtitleRef.current, {
        x: 100,
        opacity: 0,
      });

      gsap.set(paragraphRef.current, {
        x: 100,
        opacity: 0,
      });

      gsap.set(buttonRef.current, {
        scale: 0,
        opacity: 0,
      });

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      });

      tl.to(imageRef.current, {
        x: 0,
        opacity: 1,
        rotation: 0,
        duration: 1.2,
        ease: "power3.out",
      })
        .to(
          titleRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.8"
        )
        .to(
          subtitleRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .to(
          paragraphRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .to(
          buttonRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="bg-[#f6f6f6] relative overflow-hidden mt-20"
    >
      <div className="container mx-auto px-6 lg:px-20 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Image Container */}
          <div ref={imageRef} className="flex-1 max-w-lg relative">
            <div className="relative">
              <Image
                width={640}
                height={640}
                src={"/about-section.png"}
                alt="About Engel"
              />
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-1 max-w-2xl">
            <h2
              ref={titleRef}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
            >
              Über uns
            </h2>

            {/* eslint-disable react/no-unescaped-entities */}
            <h3
              ref={subtitleRef}
              className="text-2xl lg:text-3xl font-semibold text-[#fab572] mb-8"
            >
              „Unser Erbe des Luxus"
            </h3>

            <p
              ref={paragraphRef}
              className="text-lg lg:text-xl text-gray-500 leading-relaxed mb-8"
            >
              Engel ist ein führendes Unternehmen im Bereich hochwertiger
              Parfums und steht für unverwechselbare Eleganz, Stil und höchste
              Qualität. Mit einer exklusiven Auswahl an erstklassigen Düften
              bietet Engel ein außergewöhnliches Dufterlebnis, das die Sinne
              berührt und zeitlose Schönheit verkörpert.
            </p>

            <div ref={buttonRef} className="flex flex-wrap gap-2 sm:gap-3">
              <a
                href="/about"
                className="group relative px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white text-sm sm:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                style={{
                  borderRadius: "10px 42px 9px 10px",
                }}
              >
                <span>Jetzt einkaufen</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
