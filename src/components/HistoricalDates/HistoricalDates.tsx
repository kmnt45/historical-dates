import React, { FC, useState } from 'react';
import { TimeCircle } from '../TimeCircle';
import { EventsSlider } from '../EventsSlider';
import { TimeSegment } from '../../types';
import { SegmentNavigator } from '../SegmentNavigator';
import { Title } from '../Title';
import { useIsMobile } from '../../hooks/useIsMobile';
import styles from './HistoricalDates.module.scss';

type HistoricalDatesProps = {
  data: TimeSegment[];
};

export const HistoricalDates: FC<HistoricalDatesProps> = ({ data }) => {
  const [activeSegment, setActiveSegment] = useState(0);

  const isMobile = useIsMobile();

  const currentSegment = data[activeSegment];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Title title="Исторические даты" />
        <TimeCircle segments={data} activeSegment={activeSegment} onSegmentChange={setActiveSegment} />
        {!isMobile && (
          <SegmentNavigator activeSegment={activeSegment} dataLength={data.length} onChange={setActiveSegment} />
        )}
      </div>

      <EventsSlider
        key={activeSegment}
        events={currentSegment.events}
        activeSegment={activeSegment}
        dataLength={data.length}
        onChange={setActiveSegment}
      />
    </div>
  );
};
