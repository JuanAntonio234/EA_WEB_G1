export interface Activity {
    _id: string;
    author: string;
    name: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    distance: number;
    elevationGain: number;
    averageSpeed: number;
    caloriesBurned?: number;
    route: string[];
    musicPlaylist?: string[];
    type: 'running' | 'cycling' | 'hiking' | 'walking';
  }
  