export type Event = {
  id: string;
  description: string;
  date: string;
};

export type TimeSegment = {
  id: string;
  title: string;
  events: Event[];
};

export type PointCoordinates = {
  x: number;
  y: number;
};
