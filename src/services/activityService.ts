import { ApiConstants } from '../config/api_constants';
import api from '../config/axios_instance';
import { Activity } from '../types/activityTypes';

export interface PaginatedActivities {
  activities: Activity[];
  totalActivities: number;
  totalPages: number;
  currentPage: number;
  message?: string; 
}

export const getActivitiesByUserId = async (userId: string, page = 1, limit = 4): Promise<PaginatedActivities> => {
  const response = await api.get<PaginatedActivities>(`${ApiConstants.activities}/user/${userId}`, {
    params: { page, limit }
  });
  return response.data;
};

export const getAllPublicActivities = async (page?: number, limit?: number): Promise<Activity[]> => {
  let url = ApiConstants.activities; 
  
  const params: Record<string, string | number> = {};
  if (page !== undefined) {
    params.page = page;
  }
  if (limit !== undefined) {
    params.limit = limit;
  }

  try {
    const response = await api.get<Activity[]>(url, { params: Object.keys(params).length ? params : undefined }); 
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('[activityService] getAllPublicActivities: La resposta no és un array com s\'esperava:', response.data);
      return []; 
    }
  } catch (error: any) {
    console.error('[activityService] getAllPublicActivities: S\'HA PRODUÏT UN ERROR:', error);
    if (error.response) {
      console.error('[activityService] Error data (del servidor):', error.response.data);
      console.error('[activityService] Error status (del servidor):', error.response.status);
    } else if (error.request) {
      console.error('[activityService] No s\'ha rebut resposta del servidor:', error.request);
    } else {
      console.error('[activityService] Error en la configuració de la petició:', error.message);
    }
    throw error; 
  }
};

export const getActivityDetailsById = async (activityId: string): Promise<Activity> => {
  const url = `${ApiConstants.activities}/${activityId}`;
  try {
    const response = await api.get<Activity>(url);
    return response.data;
  } catch (error: any) {
    console.error(`[activityService] Error obtenint detalls de l'activitat ${activityId}:`, error);
    throw error;
  }
};