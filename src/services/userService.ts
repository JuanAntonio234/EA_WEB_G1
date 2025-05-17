import axios from 'axios';
import { User } from '../types/userTypes.ts';

interface LoginResponse {
  message: string;
  user: User;
}







///Manejar códigos de error ///









// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>('http://localhost:8080/api/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const register = async (newUser: User): Promise<User> => {
    try {
        const response = await axios.post<User>('http://localhost:8080/api/users', newUser);
        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Failed to add user');
        }
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error; 
    }
};

export const loginUser = async (username: string, password: string): Promise<User> => {
    try {
        const response = await axios.post<LoginResponse>('http://localhost:8080/api/users/login', { username, password });
        if (response.status !== 200) {
            throw new Error('Failed to log in');
        }
        return response.data.user; 
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const updateUser = async(updateUser: User): Promise<User> => {
    try{
        const response =await axios.put<User>(`http://localhost:8080/api/users/${updateUser._id}`, updateUser);
        if(response.status !==200 && response.status !==201){
            throw new Error('Failed to update user');
        }
        return response.data;
    }catch(error){
        console.error('Error updating user:',error);
        throw error;
    }
};

export const getUsersById = async (userId: string): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>(`http://localhost:8080/api/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error obtaining the user:', error);
        throw error;
    }
};

export const deleteUser = async (userId: string): Promise<void> => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/users/${userId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};