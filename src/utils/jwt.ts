import { jwtDecode } from "jwt-decode";

export const getUserFromToken = (): { email: string, username: string, role: string } | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ email: string, username: string, role: string }>(token);
    return decoded;
  } catch {
    return null;
  }
};
