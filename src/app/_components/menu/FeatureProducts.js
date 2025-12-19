"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import MenuItem from "../menu/MenuItem";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function FeaturedProducts({ menu, categories }) {
  const latestProducts = menu.slice(0, 10);

  return (
    <section className="featured-products pt-4 pb-8 px-4 max-w-7xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#222] text-left font-bold text-3xl md:text-4xl">
          Neue Produkte
        </h2>
      </div>

      <Swiper
        slidesPerView={1.2}
        spaceBetween={16}
        freeMode={true}
        freeModeSticky={true}
        resistanceRatio={0.85}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[FreeMode, Pagination, Navigation]}
        speed={600}
        touchEventsTarget="container"
        touchRatio={1}
        touchAngle={45}
        simulateTouch={true}
        watchSlidesProgress={true}
        breakpoints={{
          480: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 28,
          },
        }}
        className="featured-swiper"
      >
        {latestProducts.map((item, index) => (
          <SwiperSlide key={`${item._id}-${index}`} className="pb-8 pt-10">
            <MenuItem
              menuItemInfo={item}
              category={
                categories?.find((cat) => cat?._id === item.category)?.name
              }
              isOffersCategory={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Link href="/products/all">
        <button className="px-6 py-2 bg-[#222] text-white font-semibold rounded-lg hover:bg-[#444] transition-colors duration-300">
          Alle ansehen
        </button>
      </Link>
      <style jsx global>{`
        .featured-swiper {
          padding: 0 4px;
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }

        .featured-swiper .swiper-wrapper {
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }

        .featured-swiper .swiper-slide {
          height: auto;
          display: flex;
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          /* Remove transition - let Swiper handle it */
        }

        .featured-swiper .swiper-slide > * {
          width: 100%;
          -webkit-user-select: none;
          user-select: none;
        }

        .featured-swiper .swiper-pagination {
          bottom: 0;
          pointer-events: none;
        }

        .featured-swiper .swiper-pagination-bullet {
          background: #222;
          opacity: 0.3;
          transition: opacity 0.3s ease;
          pointer-events: auto;
        }

        .featured-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }

        .featured-swiper .swiper-button-next,
        .featured-swiper .swiper-button-prev {
          color: #222;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }

        .featured-swiper .swiper-button-next:active,
        .featured-swiper .swiper-button-prev:active {
          background: #f5f5f5;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .featured-swiper .swiper-button-next:hover,
        .featured-swiper .swiper-button-prev:hover {
          background: #f5f5f5;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .featured-swiper .swiper-button-next:after,
        .featured-swiper .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .featured-swiper .swiper-button-next,
          .featured-swiper .swiper-button-prev {
            display: none;
          }

          .featured-swiper {
            -webkit-user-select: none;
            user-select: none;
          }
        }
      `}</style>
    </section>
  );
}