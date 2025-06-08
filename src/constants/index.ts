import { PlayOption } from '../types';

export const PLAY_OPTIONS: PlayOption[] = [
  { label: '처음부터', value: 'start', secondsBefore: -1 },
  { label: '클라이맥스', value: 'climax', secondsBefore: 0 },
  { label: '5초 전', value: '5sec', secondsBefore: 5 },
  { label: '10초 전', value: '10sec', secondsBefore: 10 },
  { label: '20초 전', value: '20sec', secondsBefore: 20 },
  { label: '30초 전', value: '30sec', secondsBefore: 30 },
]; 