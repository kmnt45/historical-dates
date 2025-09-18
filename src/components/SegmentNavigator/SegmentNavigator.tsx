import React, { FC, useCallback } from 'react';
import styles from './SegmentNavigator.module.scss';

type SegmentNavigatorProps = {
  activeSegment: number;
  dataLength: number;
  onChange: (newIndex: number) => void;
};

export const SegmentNavigator: FC<SegmentNavigatorProps> = ({ activeSegment, dataLength, onChange }) => {
  const handlePrev = useCallback(() => {
    if (activeSegment > 0) onChange(activeSegment - 1);
  }, [activeSegment, onChange]);

  const handleNext = useCallback(() => {
    if (activeSegment < dataLength - 1) onChange(activeSegment + 1);
  }, [activeSegment, dataLength, onChange]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={styles.navigator}>
      <p className={styles.counter}>
        {formatNumber(activeSegment + 1)}/{formatNumber(dataLength)}
      </p>
      <div className={styles.buttons}>
        <button className={`${styles.navButton} ${styles.prev}`} onClick={handlePrev} disabled={activeSegment === 0} />
        <button
          className={`${styles.navButton} ${styles.next}`}
          onClick={handleNext}
          disabled={activeSegment === dataLength - 1}
        />
      </div>
    </div>
  );
};
