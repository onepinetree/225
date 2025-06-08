export interface Song {
  id: string;
  title: string;
  artist?: string;
  youtubeUrl: string;
  climaxTime: number; // in seconds
  thumbnailUrl?: string;
  user_id?: string;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PlayOption {
  label: string;
  value: string;
  secondsBefore: number;
} 