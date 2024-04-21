import SwiperCore, { Pagination } from "swiper";
import { Swiper, type SwiperProps } from "swiper/react";

interface CarouselProps {
  children: React.ReactNode;
}

export const Carousel = ({ children }: CarouselProps) => {
  SwiperCore.use([Pagination]);

  const swiperConfig: SwiperProps = {
    slidesPerGroup: 1,
    slidesPerView: 1,
    pagination: {
      clickable: true,
      bulletClass: "paginationBullet",
      bulletActiveClass: "paginationBulletActive",
    },
    loop: true,
  };

  return (
    <div>
      <Swiper {...swiperConfig}>{children}</Swiper>
    </div>
  );
};
