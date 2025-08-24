import apiAxios from "../../../api/apiConfig";
import type { auth } from "../Models/Auth";
import type { AuthResponse } from "../Models/AuthResponse";
import type { RegisterUser } from "../Models/RegisterUser";
import type { ResetPassword } from "../Models/ResetPassword";


export async function createUser(user: RegisterUser): Promise<RegisterUser> {
  const response = await apiAxios.post<RegisterUser>(`/auth/register`, user);
  return response.data;
}

export async function Login (Auth: auth): Promise<AuthResponse> {
  const response = await apiAxios.post<AuthResponse>(`/auth/login`, Auth);
  return response.data;
}

/** PUT /auth/reset-password con Authorization: Bearer <token> */
export async function ResetPasswd(payload: ResetPassword, token: string): Promise<void> {
  console.log('ResetPasswd token?', token); // TEMP: verifica que llega
  await apiAxios.put(`/auth/reset-password`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}