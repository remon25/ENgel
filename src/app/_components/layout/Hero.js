"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef(null);
  const statsRef = useRef(null);
  const bgLinesRef = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const stat3Ref = useRef(null);
  const stat4Ref = useRef(null);

  // Add state to control visibility
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([headingRef.current, paragraphRef.current, buttonsRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set(imageRef.current, {
        opacity: 0,
        scale: 0.8,
        rotation: -5,
      });
      gsap.set(statsRef.current?.children || [], {
        opacity: 0,
        y: 20,
      });

      // Show content after initial states are set
      setIsReady(true);

      // Animate background lines
      if (bgLinesRef.current) {
        gsap.fromTo(
          bgLinesRef.current.querySelectorAll("path"),
          {
            strokeDasharray: 1000,
            strokeDashoffset: 1000,
          },
          {
            strokeDashoffset: 0,
            duration: 2,
            stagger: 0.05,
            ease: "power2.inOut",
          }
        );
      }

      // Main timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
      })
        .to(
          paragraphRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .to(
          imageRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.8)",
          },
          "-=1"
        )
        .to(
          statsRef.current?.children || [],
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
          },
          "-=0.5"
        );

      // Animate numbers counting up
      const stats = [
        { ref: stat1Ref, end: 140, suffix: "+" },
        { ref: stat2Ref, end: 1000000, suffix: "+", format: (val) => `${(val / 1000000).toFixed(1)}M` },
        { ref: stat3Ref, end: 80, suffix: "+" },
        { ref: stat4Ref, end: 1010000, suffix: "", format: (val) => `${(val / 1000000).toFixed(2)}m` },
      ];

      stats.forEach((stat, index) => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.end,
          duration: 2,
          delay: 1.5 + index * 0.1,
          ease: "power2.out",
          onUpdate: () => {
            if (stat.ref.current) {
              const formatted = stat.format
                ? stat.format(obj.val)
                : Math.floor(obj.val) + stat.suffix;
              stat.ref.current.textContent = formatted;
            }
          },
        });
      });

      // Floating animation for image
      gsap.to(imageRef.current, {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1.5,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 overflow-hidden mt-[-44px] lg:mt-[-13px]"
    >
      {/* Decorative curved lines background */}
      <div className="absolute inset-0 opacity-30">
        <svg
          ref={bgLinesRef}
          className="absolute top-0 left-0 w-full h-full my-hero-path"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d={`M ${-100 + i * 30} 0 Q ${200 + i * 40} ${400 + i * 10} ${
                -100 + i * 30
              } 800`}
              stroke="#e7be4a"
              strokeWidth="1.5"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div 
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-24 mt-10 -mb-10 transition-opacity duration-300 ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Image First on Mobile - Order change */}
          <div ref={imageRef} className="relative order-1 lg:order-2">
            <Image
              width={600}
              height={600}
              src={"/hero-new.png"}
              className="w-full h-auto max-w-md mx-auto lg:max-w-full"
              alt="Perfume bottle"
              fetchPriority="high"
              loading="lazy"
            />
          </div>

          {/* Text Content Second on Mobile */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <h1
              ref={headingRef}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold md:font-normal leading-[1.1] text-gray-900"
            >
              Erleben Sie die Essenz
              <br />
              luxuriöser Düfte online
            </h1>

            <p
              ref={paragraphRef}
              className="text-base sm:text-lg text-gray-600 max-w-md leading-relaxed"
            >
              Mit unseren effizienten Online-Services können Sie Ihr
              Einkaufserlebnis vereinfachen und wertvolle Zeit sparen.
            </p>

            <div
              ref={buttonsRef}
              className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4"
            >
              <a
                href="/products/all"
                className="group relative px-4 sm:px-6 py-2.5 sm:py-3 bg-[#e7be4a] text-white text-sm sm:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                style={{
                  borderRadius: "10px 42px 9px 10px",
                }}
              >
                <span>Jetzt einkaufen</span>
              </a>

              <a
                href="/about"
                className="relative text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{
                  borderRadius: "9px 10px 10px 42px",
                }}
              >
                Details ansehen
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        ref={statsRef}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mt-12 sm:mt-20 py-8 sm:py-10 bg-[#fdf6ed] relative px-4 sm:px-6"
      >
        <div className="text-center relative" style={{ opacity: 0 }}>
          <div ref={stat1Ref} className="text-3xl sm:text-4xl font-bold text-gray-900">
            +140
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            Verfügbare Produkte
          </div>
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gray-300"></div>
        </div>

        <div className="text-center relative" style={{ opacity: 0 }}>
          <div ref={stat2Ref} className="text-3xl sm:text-4xl font-bold text-gray-900">
            +1M
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            Bereits getätigte Verkäufe
          </div>
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gray-300"></div>
        </div>

        <div className="text-center relative" style={{ opacity: 0 }}>
          <div ref={stat3Ref} className="text-3xl sm:text-4xl font-bold text-gray-900">
            +80
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            Industrielle Franchises
          </div>
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gray-300"></div>
        </div>

        <div className="text-center" style={{ opacity: 0 }}>
          <div ref={stat4Ref} className="text-3xl sm:text-4xl font-bold text-gray-900">
            1.01m
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            Verbindungen
          </div>
        </div>
      </div>
    </div>
  );
}