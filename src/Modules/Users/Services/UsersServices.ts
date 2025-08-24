
import apiAxios from "../../../api/apiConfig";
import type { EditUser } from "../Models/EditUser";
import type { UserProfile } from "../Models/User";

export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiAxios.get<UserProfile>(`users/me`);
  return response.data;
}

export async function updateUserProfile(User: EditUser) : Promise<EditUser>{
  const res = await apiAxios.put<EditUser>(`users/me`, User)
  return res.data;
}