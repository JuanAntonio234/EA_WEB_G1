export interface User {
  _id: string; 
  username: string;
  email: string;
  password?: string; 
  profilePicture?: string;
  bio?: string;
  level: number;
  totalDistance: number;
  totalTime: number;
  followersCount?: number;
  followingCount?: number;
  activities: string[]; 
  achievements: string[];
  challengesCompleted: string[];
  createdAt: string; 
  updatedAt: string;
  visibility: boolean;
  role: 'user' | 'admin';
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
