"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PerfumeShowcase() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states with new effects
      gsap.set(titleRef.current, {
        opacity: 0,
        rotationX: -45,
        y: 50,
        transformOrigin: "center bottom",
      });

      gsap.set(paragraphRef.current, {
        opacity: 0,
        x: -60,
        filter: "blur(10px)",
      });

      gsap.set(buttonRef.current, {
        opacity: 0,
        y: 30,
        rotationX: 45,
      });

      gsap.set(imageContainerRef.current, {
        opacity: 0,
        scale: 0.7,
        rotation: -5,
      });

      gsap.set(imageRef.current, {
        scale: 1.4,
        rotation: 5,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      });

      // Title animation - 3D flip in
      tl.to(titleRef.current, {
        opacity: 1,
        rotationX: 0,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      })
        // Paragraph - slide from left with blur fade
        .to(
          paragraphRef.current,
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
          },
          "-=0.7"
        )
        // Button - bounce in from below
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        )
        // Image container - zoom and rotate in
        .to(
          imageContainerRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.3,
            ease: "power2.out",
          },
          0.2
        )
        // Image inside - counter rotation and scale
        .to(
          imageRef.current,
          {
            scale: 1,
            rotation: 0,
            duration: 1.6,
            ease: "power2.out",
          },
          0.2
        );

      // Smooth parallax effect on image with rotation
      gsap.to(imageRef.current, {
        y: -40,
        rotation: 2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Enhanced button hover with rotation
      if (buttonRef.current) {
        buttonRef.current.addEventListener("mouseenter", () => {
          gsap.to(buttonRef.current, {
            scale: 1.08,
            y: -3,
            rotationY: 5,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        buttonRef.current.addEventListener("mouseleave", () => {
          gsap.to(buttonRef.current, {
            scale: 1,
            y: 0,
            rotationY: 0,
            duration: 0.4,
            ease: "power2.out",
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 mt-12 sm:mt-16 lg:mt-20"
    >
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Content Section - First on mobile, second on desktop */}
          <div className="order-2 md:order-1 px-4 sm:px-6 lg:px-12 flex flex-col justify-center">
            <h1
              ref={titleRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
            >
              Ein Bekenntnis zur Reinheit
            </h1>

            <p
              ref={paragraphRef}
              className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8"
            >
              Wir glauben an nachhaltigen Luxus. Jede Flasche ENGEL PARFUMS wird
              mit verantwortungsvoll gewonnenen Inhaltsstoffen hergestellt, um
              einen bleibenden Eindruck bei Ihnen zu hinterlassen – nicht auf
              die Umwelt.
            </p>

            <button
              ref={buttonRef}
              className="relative w-fit text-sm px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              style={{
                borderRadius: "10px 42px 9px 10px",
              }}
            >
              Details ansehen
            </button>
          </div>

          {/* Image Section - First on mobile, second on desktop */}
          <div
            ref={imageContainerRef}
            className="order-1 md:order-2 relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-lg md:rounded-none"
          >
            <div ref={imageRef} className="relative w-full h-full">
              <Image
                src="/commitment.png"
                alt="Luxuriöser Parfümflakon mit Holzuntersetzer und Perlen"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}