import React, { FC, useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper/types';
import { Event } from '../../types';
import { SegmentNavigator } from '../SegmentNavigator';
import { useIsMobile } from '../../hooks/useIsMobile';
import styles from './EventsSlider.module.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type EventsSliderProps = {
  events: Event[];
  activeSegment: number;
  dataLength: number;
  onChange: (newIndex: number) => void;
};

export const EventsSlider: FC<EventsSliderProps> = ({ events, activeSegment, dataLength, onChange }) => {
  const prevRef = useRef<HTMLDivElement>(null);

  const nextRef = useRef<HTMLDivElement>(null);

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const [canSlidePrev, setCanSlidePrev] = useState(false);

  const [canSlideNext, setCanSlideNext] = useState(true);

  const isMobile = useIsMobile();

  const handleSlideChange = () => {
    if (!swiperInstance) return;

    setCanSlidePrev(!swiperInstance.isBeginning);

    setCanSlideNext(!swiperInstance.isEnd);
  };

  useEffect(() => {
    if (swiperInstance && !isMobile && prevRef.current && nextRef.current && swiperInstance.navigation) {
      swiperInstance.params.navigation.prevEl = prevRef.current;

      swiperInstance.params.navigation.nextEl = nextRef.current;

      swiperInstance.navigation.init();

      swiperInstance.navigation.update();
    }
  }, [swiperInstance, isMobile]);

  return (
    <div className={styles.sliderContainer}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={isMobile ? 16 : 80}
        slidesPerView={isMobile ? 'auto' : 3}
        onSwiper={(swiper: SwiperType) => {
          setSwiperInstance(swiper);
          setCanSlidePrev(!swiper.isBeginning);
          setCanSlideNext(!swiper.isEnd);
        }}
        onSlideChange={handleSlideChange}
        onBeforeInit={(swiper: SwiperType) => {
          if (!isMobile && prevRef.current && nextRef.current) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        navigation={!isMobile ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
        pagination={
          isMobile
            ? {
                clickable: true,
                el: `.${styles.pagination}`,
                bulletClass: styles.bullet,
                bulletActiveClass: styles.bulletActive,
              }
            : false
        }
      >
        {events.map((event, index) => (
          <SwiperSlide key={`${event.id ?? index}-${index}`} className={styles.slide}>
            <div className={styles.event}>
              <h4 className={styles.date}>{event.date}</h4>
              <p className={styles.description}>{event.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {!isMobile && (
        <>
          <div
            ref={prevRef}
            className={`${styles.navButton} ${styles.prev}`}
            style={{ display: canSlidePrev ? 'flex' : 'none' }}
          />
          <div
            ref={nextRef}
            className={`${styles.navButton} ${styles.next}`}
            style={{ display: canSlideNext ? 'flex' : 'none' }}
          />
        </>
      )}

      {isMobile && (
        <div className={styles.mobileControls}>
          <SegmentNavigator activeSegment={activeSegment} dataLength={dataLength} onChange={onChange} />
          <div className={styles.pagination} />
        </div>
      )}
    </div>
  );
};
