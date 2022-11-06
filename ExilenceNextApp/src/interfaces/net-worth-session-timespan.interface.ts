export type TimestapTypes = 'start' | 'pause' | 'offline' | 'notActive';
export type TimestapTypesExtended = TimestapTypes | 'keeplast';

export interface ITimeStamp {
  uuid: string;
  type: TimestapTypes;
  start: number;
  end: number;
  duration: number;
  sessionDuration: number;
}
