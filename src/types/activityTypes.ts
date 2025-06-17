export interface AuthorInfo {
  _id: string;
  username: string;
}

export interface Song {
  _id: string;
  title: string;
  artist?: string;
}

export interface ReferencePoint {
  _id: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp?: Date | string;
}

export interface Activity {
  _id: string;
  author: AuthorInfo | string; 
  name: string;
  startTime: Date | string;
  endTime: Date | string;
  duration: number;
  distance: number; 
  elevationGain: number;
  averageSpeed: number;
  caloriesBurned?: number;
  route: ReferencePoint[] | string[];
  musicPlaylist?: Song[] | string[];
  type: 'running' | 'cycling' | 'hiking' | 'walking';
}

export interface PaginatedActivities {
  activities: Activity[];
  totalActivities: number;
  totalPages: number;
  currentPage: number;
  message?: string; 
}