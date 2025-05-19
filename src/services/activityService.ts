import { ApiConstants } from '../config/api_constants';
import api from '../config/axios_instance.ts';
import { Activity } from '../types/activityTypes.ts';
export interface PaginatedActivities {
  activities: Activity[];
  totalActivities: number;
  totalPages: number;
  currentPage: number;
}

// Obtener actividades paginadas
export const getActivitiesByUserId = async (userId: string, page = 1, limit = 4): Promise<PaginatedActivities> => {
  const response = await api.get<PaginatedActivities>(`${ApiConstants.activities}/user/${userId}`, {
    params: { page, limit }
  });
  return response.data;
};