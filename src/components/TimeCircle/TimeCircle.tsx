import React, { FC, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { PointCoordinates, TimeSegment } from '../../types';
import { gsap } from 'gsap';
import styles from './TimeCircle.module.scss';

type TimeCircleProps = {
  segments: TimeSegment[];
  activeSegment: number;
  onSegmentChange: (index: number) => void;
};

export const TimeCircle: FC<TimeCircleProps> = ({ segments, activeSegment, onSegmentChange }) => {
  const pointsWrapperRef = useRef<HTMLDivElement>(null);

  const datesRef = useRef<HTMLDivElement>(null);

  const currentRotation = useRef(0);

  const [dates, setDates] = useState({ start: 0, end: 0 });

  const radius = 265;

  const calculatePointPosition = useCallback((index: number): PointCoordinates => {
    const angle = (Math.PI / 3) * index - Math.PI / 3;

    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  }, []);

  const pointPositions = useMemo(
    () => segments.map((_, i) => calculatePointPosition(i)),

    [segments, calculatePointPosition],
  );

  const getSegmentDatesRange = useCallback((segment: TimeSegment) => {
    const years = segment.events.map((e) => parseInt(e.date.split('/').pop() || '0', 10)).filter((year) => year > 0);

    if (!years.length) return { start: 0, end: 0 };

    return { start: Math.min(...years), end: Math.max(...years) };
  }, []);

  const animateDate = useCallback((from: number, to: number, type: 'start' | 'end') => {
    gsap.to(
      { val: from },
      {
        val: to,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate() {
          setDates((prev) => ({ ...prev, [type]: Math.round(this.targets()[0].val) }));
        },
      },
    );
  }, []);

  const rotateToSegment = useCallback(
    (index: number) => {
      if (!pointsWrapperRef.current) return;

      const anglePerSegment = 360 / segments.length;

      const targetRotation = -anglePerSegment * index;

      const delta = ((targetRotation - currentRotation.current + 180) % 360) - 180;

      const finalRotation = currentRotation.current + delta;

      const segmentDates = getSegmentDatesRange(segments[index]);

      animateDate(dates.start, segmentDates.start, 'start');

      animateDate(dates.end, segmentDates.end, 'end');

      gsap.to(currentRotation, {
        current: finalRotation,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => {
          gsap.set(pointsWrapperRef.current, { rotation: currentRotation.current });

          const rotateElements = (selector: string) =>
            gsap.utils
              .toArray<HTMLElement>(selector)
              .forEach((el) => gsap.set(el, { rotation: -currentRotation.current }));

          rotateElements(`.${styles.segmentNumber}`);

          rotateElements(`.${styles.segmentTitle}`);
        },
      });
    },
    [segments, getSegmentDatesRange, animateDate, dates.start, dates.end],
  );

  useEffect(() => {
    const segmentDates = getSegmentDatesRange(segments[activeSegment]);

    setDates(segmentDates);

    if (datesRef.current) {
      gsap.fromTo(datesRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }
  }, [segments, activeSegment, getSegmentDatesRange]);

  useEffect(() => {
    rotateToSegment(activeSegment);
  }, [activeSegment, rotateToSegment]);

  return (
    <div className={styles.circleContainer}>
      <div className={styles.circleLines} />
      <div ref={datesRef} className={styles.centerDates}>
        <span className={styles.startDate}>{dates.start}</span>
        <span className={styles.endDate}>{dates.end}</span>
      </div>
      <div className={styles.circle} />
      <div className={styles.pointsWrapper} ref={pointsWrapperRef}>
        {segments.map((segment, index) => {
          const position = pointPositions[index];

          const isActive = index === activeSegment;

          return (
            <React.Fragment key={segment.id}>
              <button
                className={`${styles.point} ${isActive ? styles.active : ''}`}
                style={{
                  left: `calc(50% + ${position.x}px)`,
                  top: `calc(50% + ${position.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => onSegmentChange(index)}
              >
                <span className={styles.pointInner} />
                <span className={styles.segmentNumber}>{index + 1}</span>
              </button>

              {isActive && (
                <span
                  className={styles.segmentTitle}
                  style={{
                    left: `calc(50% + ${position.x + 50}px)`,
                    top: `calc(50% + ${position.y}px)`,
                    transform: 'translateY(-50%)',
                  }}
                >
                  {segment.title}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
