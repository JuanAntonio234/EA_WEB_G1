import api from '../config/axios_instance';
import { ApiConstants } from '../config/api_constants';
import { Challenge } from '../types/challengeTypes';

export const getChallengeById = async (id: string): Promise<Challenge> => {
    const response = await api.get<Challenge>(`${ApiConstants.challenges}/${id}`);
    return response.data;
};