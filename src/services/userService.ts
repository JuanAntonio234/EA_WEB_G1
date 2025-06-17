import api from '../config/axios_instance.ts';
import { ApiConstants } from '../config/api_constants';
import { RegisterData, User } from '../types/userTypes.ts';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface FollowListResponse {
  message: string;
  count: number;
  followers?: User[]; 
  following?: User[];
}

interface FollowStatusResponse {
  isFollowing: boolean;
  isFollowedBy: boolean;
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
        localStorage.setItem('userId', response.data.user._id);
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

export const updateUser = async(updateUserData: Partial<User> & { _id: string }): Promise<User> => {
    try{
        const response = await api.put<{ message: string, user: User }>(`${ApiConstants.users}/${updateUserData._id}`, updateUserData);
        if(response.status !== 200){ 
            throw new Error(`Failed to update user. Status: ${response.status}`);
        }
        return response.data.user; 
    }catch(error: any){ 
        console.error('Error updating user:', error.response?.data || error.message || error);
        throw error.response?.data || error; 
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


export const searchUsers = async (query: string) => {
  if (query.length < 2) return [];

  try {
    const response = await api.get(`http://localhost:3000/api/users/search?search=${encodeURIComponent(query)}`);
    return response.data.users;
  } catch (error: any) {
    if (error.response?.status === 404) {
        throw new Error('No se han encontrado usuarios');
    } else {
      throw new Error('Error al buscar usuarios');
    }
  }
};

export const getUserFollowers = async (userId: string): Promise<User[]> => {
  try {
    const response = await api.get<FollowListResponse>(`${ApiConstants.users}/${userId}/followers`);
    return response.data.followers || [];
  } catch (error) {
    console.error('Error fetching followers:', error);
    return []; 
  }
};

export const getUserFollowing = async (userId: string): Promise<User[]> => {
  try {
    const response = await api.get<FollowListResponse>(`${ApiConstants.users}/${userId}/following`);
    return response.data.following || [];
  } catch (error) {
    console.error('Error fetching following list:', error);
    return [];
  }
};

export const checkFollowStatus = async (currentUserId: string, targetUserId: string): Promise<FollowStatusResponse> => {
  try {
    const response = await api.get<FollowStatusResponse>(`/api/users/${currentUserId}/follow-status/${targetUserId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return { isFollowing: false, isFollowedBy: false };
  }
};

export const followUser = async (currentUserId: string, targetUserId: string): Promise<void> => {
  try {
    await api.post(`${ApiConstants.users}/${currentUserId}/follow/${targetUserId}`);
  } catch(error) {
    console.error(`Error trying to follow user ${targetUserId}:`, error);
    throw error;
  }
};

export const unfollowUser = async (currentUserId: string, targetUserId: string): Promise<void> => {
  try {
    await api.post(`${ApiConstants.users}/${currentUserId}/unfollow/${targetUserId}`);
  } catch(error) {
    console.error(`Error trying to unfollow user ${targetUserId}:`, error);
    throw error;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
        // Obtener userId del localStorage o del token
        let userId = localStorage.getItem('userId');
        
        if (!userId) {
            // Intentar obtener del token si no está en localStorage
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    userId = decoded.id || decoded.userId;
                } catch (error) {
                    console.error('Error decodificando token:', error);
                    throw new Error('Usuario no autenticado');
                }
            }
        }
        
        if (!userId) {
            throw new Error('Usuario no autenticado');
        }

        const response = await api.put(`${ApiConstants.users}/${userId}`, {
            currentPassword,
            password: newPassword,
        });

        if (response.status !== 200) {
            throw new Error('Failed to change password');
        }
    } catch (error: any) {
        console.error('Error changing password:', error);
        if (error.response?.status === 401) {
            throw new Error('La contraseña actual es incorrecta');
        }
        throw error;
    }
};