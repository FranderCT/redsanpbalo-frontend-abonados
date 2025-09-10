
import apiAxios from "../../../api/apiConfig";
import type { RegisterUser } from "../../Auth/Models/RegisterUser";
import type { UpdateEmailUser } from "../../SettingsUser/Models/EmailUser";
import type { EditUser } from "../Models/EditUser";
import type { Roles } from "../Models/Roles";
import type { UserProfile } from "../Models/User";
import type { Users, UserUpdate } from "../Models/Users";


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
  const res = await apiAxios.get<Users[]>(`/users`);
  return res.data;
}

export async function deleteUser(id: number): Promise<any> {
  const res = await apiAxios.delete(`/users/${id}`);
  return res.data;
}

export async function createUserModal(user: Omit<RegisterUser, "ConfirmPassword"> & { RoleIds: number[] }) {
  const { data } = await apiAxios.post("/users", user);
  return data;
}

export async function getAllRoles(): Promise<Roles[]> {
  try{
   const { data } = await apiAxios.get<Roles[]>("/roles");
    return data;
  }catch(err){
    console.log(err);
    return Promise.reject(err);
  }
}

export async function updateUser(id: number, payloads: UserUpdate) : Promise<Users>{
  try{
    const res = await apiAxios.put<Users>(`users/${id}`, payloads);
    return res.data;
  }catch(err){
    console.log(err);
    return Promise.reject(err);
  }
}

export async function getUserById(id: number) : Promise<Users>{
  try{
    const {data} = await apiAxios.get<Users>(`users/${id}`);
    return data;
  }catch(err){
    console.error("Error al obtener la informacion del ususario", err);
    return Promise.reject(err);
  }
}

export async function deteleUserById(id: number) : Promise<void>{
  try{
    await apiAxios.delete(`users/${id}`);
  }catch(err){
    console.error("Error al eliminar Usuario", err);
  }
}