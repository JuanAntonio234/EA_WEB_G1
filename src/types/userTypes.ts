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
  activities: string[]; 
  achievements: string[];
  challengesCompleted: string[];
  createdAt: string; 
  updatedAt: string;
  visibility: boolean;
  role: 'user' | 'admin';
}
