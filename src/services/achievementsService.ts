import api from '../config/axios_instance';
import { Achievement } from '../types/achievementTypes';
import { ApiConstants } from '../config/api_constants';

export const getAchievementById = async (id: string): Promise<Achievement> => {
    const response = await api.get<Achievement>(`${ApiConstants.achievements}/${id}`);
    return response.data;
};