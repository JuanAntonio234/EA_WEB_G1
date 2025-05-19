export interface Achievement {
    _id: string;
    title: string;
    description: string; 
    condition: string;
    icon: string;
    usersUnlocked: string[];
    type: 'distance_total' | 'distance_single' | 'time_total' | 'time_single' | 'time_monthly' | 'time_yearly' | 'activity_count' | 'consecutive_days' | 'speed_average' | 'elevation_gain';
    targetValue: number;
    activityType?: 'running' | 'cycling' | 'hiking' | 'walking' | 'all';
    difficulty: 'bronze' | 'silver' | 'gold' | 'diamond';
    points: number;
    createdAt?: Date;
}