import React from 'react';
import { HistoricalDates } from './components/HistoricalDates';
import { mockData } from './mockData';

export const App = () => {
  return (
    <>
      <HistoricalDates data={mockData} />
    </>
  );
};
