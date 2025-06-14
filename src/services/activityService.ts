import { ApiConstants } from '../config/api_constants';
import api from '../config/axios_instance';
import { Activity, PaginatedActivities } from '../types/activityTypes';

interface FeedResponse {
  activities: Activity[];
  hasMore: boolean;
}

export const getFullActivityFeed = async (userId: string): Promise<Activity[]> => {
  const relativeUrl = `/api/activities/following/${userId}`; 
  
  try {
    const response = await api.get<FeedResponse>(relativeUrl, {
      params: { page: 1, limit: 1000 }
    });
    return response.data.activities;
  } catch (error: any) {
    console.error(`[activityService] Error obteniendo el feed completo para ${userId} desde ${relativeUrl}:`, error);
    throw error;
  }
};

export const getActivitiesByUserId = async (userId: string, page = 1, limit = 4): Promise<PaginatedActivities> => {
  const response = await api.get<PaginatedActivities>(`/api/activities/user/${userId}`, {
    params: { page, limit }
  });
  return response.data;
};

export const getAllPublicActivities = async (page?: number, limit?: number): Promise<Activity[]> => {
  const params: Record<string, string | number> = {};
  if (page !== undefined) params.page = page;
  if (limit !== undefined) params.limit = limit;

  try {
    const response = await api.get<Activity[]>('/api/activities', { params: Object.keys(params).length ? params : undefined });
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.error('[activityService] getAllPublicActivities: ERROR:', error);
    throw error;
  }
};

export const getActivityDetailsById = async (activityId: string): Promise<Activity> => {
  const url = `/api/activities/${activityId}`;
  try {
    const response = await api.get<Activity>(url);
    return response.data;
  } catch (error: any) {
    console.error(`[activityService] Error obteniendo detalles de la actividad ${activityId}:`, error);
    throw error;
  }
};
