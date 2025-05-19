import api from '../config/axios_instance.ts';
import { ApiConstants } from '../config/api_constants';
import { RegisterData, User } from '../types/userTypes.ts';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get<User[]>(ApiConstants.users);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const register = async (newUser: RegisterData): Promise<string> => {
    try {
        const response = await api.post<LoginResponse>(ApiConstants.register, newUser);
        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Failed to add user');
        }
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data.token;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error; 
    }
};

export const loginUser = async (email: string, password: string): Promise<string> => {
    try {
        const response = await api.post<LoginResponse>(ApiConstants.login, { email, password });
        if (response.status !== 200) {
            throw new Error('Failed to log in');
        }
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data.token; 
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const logoutUser = async (): Promise<void> => {
    try {
        const token = localStorage.getItem('accessToken');
        await api.post(
            ApiConstants.logout, {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error('Error al tancar sessió:', error);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

export const updateUser = async(updateUser: User): Promise<User> => {
    try{
        const response =await api.put<User>(`${ApiConstants.users}/${updateUser._id}`, updateUser);
        if(response.status !==200 && response.status !==201){
            throw new Error('Failed to update user');
        }
        return response.data;
    }catch(error){
        console.error('Error updating user:',error);
        throw error;
    }
};

export const getUserById = async (userId: string): Promise<User> => {
    try {
        const response = await api.get<User>(`${ApiConstants.users}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error obtaining the user:', error);
        throw error;
    }
};

export const deleteUser = async (userId: string): Promise<void> => {
    try {
        const response = await api.delete(`${ApiConstants.users}/${userId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};