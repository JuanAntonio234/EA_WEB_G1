import api from '../config/axios_instance';
import { Achievement, UserAchievementsApiResponse } from '../types/achievementTypes'; 
import { ApiConstants } from '../config/api_constants';

export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  const url = `${ApiConstants.achievements}/user/${userId}`;
  console.log(`[achievementService] Intentant obtenir assoliments per a userId: ${userId} des de ${url}`);

  try {
    const response = await api.get<UserAchievementsApiResponse>(url);
    console.log('[achievementService] Resposta de l\'API rebuda (objecte Axios):', response);
    console.log('[achievementService] Cos de la resposta del servidor (response.data):', response.data);

    const achievementsDetails = response.data?.data; 
    console.log('[achievementService] Detalls dels assoliments (response.data.data):', achievementsDetails);

    if (achievementsDetails && Array.isArray(achievementsDetails.unlocked)) {
      console.log('[achievementService] Èxit: Retornant achievementsDetails.unlocked:', achievementsDetails.unlocked);
      return achievementsDetails.unlocked; 
    } else {
      console.error('[achievementService] Error: achievementsDetails.unlocked no és un array o achievementsDetails no existeix. Valor de achievementsDetails:', achievementsDetails);
      return []; 
    }
  } catch (error: any) {
    console.error('[achievementService] S\'HA PRODUÏT UN ERROR en la crida a l\'API:', error);
    if (error.response) {
      console.error('[achievementService] Error data (del servidor):', error.response.data);
      console.error('[achievementService] Error status (del servidor):', error.response.status);
    } else if (error.request) {
      console.error('[achievementService] No s\'ha rebut resposta del servidor:', error.request);
    } else {
      console.error('[achievementService] Error en la configuració de la petició:', error.message);
    }
    throw error; 
  }
};

export const getAchievementById = async (id: string): Promise<Achievement> => {
  const response = await api.get<Achievement>(`${ApiConstants.achievements}/${id}`);
  return response.data;
};