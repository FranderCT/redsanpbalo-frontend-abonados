import { api } from "../../../api/apiConfig";
import type { User } from "../Models/User";



export async function createUser(user: User): Promise<User> {
  const response = await api.post<User>('/auth/register', user);
  return response.data;
}