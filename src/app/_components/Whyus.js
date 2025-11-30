"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imagesRef = useRef([]);
  const featuresRef = useRef([]);

  const features = [
    {
      number: "01",
      title: "Künstlerisches Design",
      description:
        "Jeder Duft ist ein Meisterwerk, mit höchster Präzision von Weltklasse-Parfümeuren kreiert.",
    },
    {
      number: "02",
      title: "Organische Inhaltsstoffe",
      description:
        "Aus den edelsten Quellen der Natur gewonnen – jede Note verkörpert reine Raffinesse.",
    },
    {
      number: "03",
      title: "Nachhaltige Eleganz",
      description:
        "Genießen Sie Düfte ohne schlechtes Gewissen – entwickelt, um unseren Planeten zu schützen.",
    },
    {
      number: "04",
      title: "Exklusive Kollektionen",
      description:
        "Entdecken Sie Düfte, so selten und einzigartig wie die Momente, die sie inspirieren.",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.9,
      });

      gsap.set(subtitleRef.current, {
        opacity: 0,
        x: -30,
      });

      gsap.set(imagesRef.current, {
        opacity: 0,
        scale: 0.8,
        rotation: 5,
      });

      gsap.set(featuresRef.current, {
        opacity: 0,
        y: 30,
        x: 30,
      });

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none none",
        },
      });

      // Animate title with scale
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // Animate images in a wave pattern
        .to(
          imagesRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            stagger: {
              each: 0.15,
              from: "start",
              ease: "power2.out",
            },
          },
          "-=0.3"
        )
        // Animate feature cards with stagger
        .to(
          featuresRef.current,
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.7,
            stagger: {
              each: 0.15,
              from: "start",
            },
            ease: "power3.out",
          },
          "-=0.4"
        );

      // Hover animations for images
      imagesRef.current.forEach((img) => {
        if (img) {
          img.addEventListener("mouseenter", () => {
            gsap.to(img, {
              scale: 1.05,
              rotation: -2,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          img.addEventListener("mouseleave", () => {
            gsap.to(img, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        }
      });

      // Hover animations for feature cards
      featuresRef.current.forEach((feature) => {
        if (feature) {
          feature.addEventListener("mouseenter", () => {
            gsap.to(feature, {
              y: -5,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          feature.addEventListener("mouseleave", () => {
            gsap.to(feature, {
              y: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="bg-gradient-to-r from-amber-50 via-white to-amber-50 py-16 px-4 sm:px-6 lg:px-8 shadow-sm"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <div>
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
              >
                Warum wir?
              </h1>
              <p
                ref={subtitleRef}
                className="text-amber-600 text-base sm:text-lg font-medium"
              >
                Luxus neu definiert – geschaffen für das Außergewöhnliche
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md">
              {["/why-us-3.png", "/why-us-2.png", "/why-us-4.png", "/why-us-1.png"].map(
                (src, index) => (
                  <div
                    key={index}
                    ref={(el) => (imagesRef.current[index] = el)}
                    className="rounded-xl overflow-hidden shadow-lg cursor-pointer relative h-40"
                  >
                    <Image
                      src={src}
                      alt={`Perfume ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="h-full grid grid-cols-1 sm:grid-cols-2 gap-8 content-between">
            {features.map((feature, index) => (
              <div
                key={feature.number}
                ref={(el) => (featuresRef.current[index] = el)}
                className="space-y-3 cursor-pointer"
              >
                <div
                  className="text-amber-500 text-[16px] font-semibold bg-white p-1 shadow-lg w-12 flex justify-center items-center mb-4"
                  style={{
                    borderRadius: "9px 10px 10px 42px",
                  }}
                >
                  {feature.number}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}