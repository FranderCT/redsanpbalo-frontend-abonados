
import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { RegisterUser } from "../../Auth/Models/RegisterUser";
import type { UpdateEmailUser } from "../../SettingsUser/Models/EmailUser";
import type { Roles } from "../Models/Roles";
import type { UpdateUser, User, UsersPaginationParams, UserUpdateMe } from "../Models/User";

const BASE = "/users";

export async function getUserProfile(): Promise<User> {
  try{
  const response = await apiAxios.get<User>(`${BASE}/me`);
  return response.data;
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
  
}

export async function updateUserEmail(User: UpdateEmailUser) : Promise<UpdateEmailUser>{
  try{
    const res = await apiAxios.put<UpdateEmailUser>(`${BASE}/update/email`, User)
    return res.data;
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
}

export async function updateUserProfile(User: UserUpdateMe) : Promise<User>{
  try{
  const res = await apiAxios.put<User>(`${BASE}/me`, User)
  return res.data;  
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
  
}

export async function getAllUsers(): Promise<User[]> {
  try{
    const res = await apiAxios.get<User[]>(`${BASE}`);
    return res.data;
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
  
}

export async function deleteUser(id: number): Promise<void> {
  try{
    await apiAxios.delete(`${BASE}/${id}`);
  }catch(err){
    console.error(err);
  }
}

//REHACER
export async function createUserModal(user: Omit<RegisterUser, "ConfirmPassword"> & { RoleIds: number[] }) {
  try{
    const { data } = await apiAxios.post(`${BASE}`, user);
    return data;
  }catch(err){
    console.error('error');
    return Promise.reject(err);
  }
}

export async function getAllRoles(): Promise<Roles[]> {
  try{
    const { data } = await apiAxios.get<Roles[]>(`/roles`);
    return data;
  }catch(err){
    console.log(err);
    return Promise.reject(err);
  }
}

export async function updateUser(id: number, payloads: UpdateUser) : Promise<User>{
  try{
    const res = await apiAxios.put<User>(`${BASE}/${id}`, payloads);
    return res.data;
  }catch(err){
    console.log(err);
    return Promise.reject(err);
  }
}

export async function getUserById(id: number) : Promise<User>{
  try{
    const {data} = await apiAxios.get<User>(`${BASE}/${id}`);
    return data;
  }catch(err){
    console.error("Error al obtener la informacion del ususario", err);
    return Promise.reject(err);
  }
}

export async function deteleUserById(id: number) : Promise<void>{
  try{
    await apiAxios.delete(`${BASE}/${id}`);
  }catch(err){
    console.error("Error al eliminar Usuario", err);
  }
}

export async function searchUsers(params: UsersPaginationParams) {
  try{
    const { data } = await apiAxios.get<PaginatedResponse<User>>(`${BASE}/search`, { params });
    return data;
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
  
}

export async function getUserByRoleAdmin () : Promise<User[]>{
  try{
    const {data} = await apiAxios.get<User[]>(`${BASE}/role-admin`);
    return data;
  }catch(err){
    return Promise.reject(err);
  }
}

export async function getUsersByRoleFontanero(): Promise<User[]> {
  try {
    const { data } = await apiAxios.get<User[]>(`${BASE}/role-fontanero`);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}