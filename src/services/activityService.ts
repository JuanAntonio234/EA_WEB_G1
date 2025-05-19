import axios from 'axios';
import { Activity } from '../types/activityTypes.ts';

const API_URL = 'http://localhost:3000/api/activities';

export interface PaginatedActivities {
  activities: Activity[];
  totalActivities: number;
  totalPages: number;
  currentPage: number;
}

// Obtener actividades paginadas
export const getActivitiesByUserId = async (userId: string, page = 1, limit = 4): Promise<PaginatedActivities> => {
  const response = await axios.get<PaginatedActivities>(`${API_URL}/user/${userId}`, {
    params: { page, limit }
  });
  return response.data;
};