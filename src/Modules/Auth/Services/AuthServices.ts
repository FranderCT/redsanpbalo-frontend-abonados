import type { User } from "../Models/User";

export async function createUser (user: User): Promise <User> {
  const response = await axios.post<User>('/auth/register', user);
  return response.data;
}