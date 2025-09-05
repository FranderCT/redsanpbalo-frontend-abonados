
import apiAxios from "../../../api/apiConfig";
import type { UpdateEmailUser } from "../../SettingsUser/Models/EmailUser";
import type { EditUser } from "../Models/EditUser";
import type { UserProfile } from "../Models/User";
import type { Users } from "../Models/Users";

export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiAxios.get<UserProfile>(`users/me`);
  return response.data;
}

export async function updateUserEmail(User: UpdateEmailUser) : Promise<UpdateEmailUser>{
  const res = await apiAxios.put<UpdateEmailUser>(`/users/update/email`, User)
  return res.data;
}

export async function updateUserProfile(User: EditUser) : Promise<EditUser>{
  const res = await apiAxios.put<EditUser>(`users/me`, User)
  return res.data;
}

export async function getAllUsers(): Promise<Users[]> {
  const res = await apiAxios.get<Users[]>("/users");
  return res.data;
}

export async function deleteUser(id: number): Promise<any> {
  const res = await apiAxios.delete(`/users/${id}`);
  return res.data;
}
