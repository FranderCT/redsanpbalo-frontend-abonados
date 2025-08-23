import apiAxios from "../../../api/apiConfig";
import type { auth } from "../Models/Auth";
import type { AuthResponse } from "../Models/AuthResponse";
import type { User } from "../Models/RegisterUser";


export async function createUser(user: User): Promise<User> {
  const response = await apiAxios.post<User>(`/auth/register`, user);
  return response.data;
}

export async function Login (Auth: auth): Promise<AuthResponse> {
  const response = await apiAxios.post<AuthResponse>(`/auth/login`, Auth);
  return response.data;
}