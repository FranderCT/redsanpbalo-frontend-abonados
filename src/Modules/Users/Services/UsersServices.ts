
import apiAxios from "../../../api/apiConfig";
import type { PaginatedResponse } from "../../../assets/Dtos/PaginationCategory";
import type { RegisterUser } from "../../Auth/Models/RegisterUser";
import type { UpdateEmailUser } from "../../SettingsUser/Models/EmailUser";
import type { Roles } from "../Models/Roles";
import type { UpdateUser, User, UsersPaginationParams, UserUpdateMe } from "../Models/User";

const BASE = "/users";

function getRequiredAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    throw new Error("No hay una sesion activa. Inicia sesion nuevamente.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getUserProfile(): Promise<User> {
  try{
  const response = await apiAxios.get<User>(`${BASE}/me`, {
    headers: getRequiredAuthHeaders(),
  });
  return response.data;
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
  
}

export async function updateUserEmail(User: UpdateEmailUser) : Promise<UpdateEmailUser>{
  try{
    const res = await apiAxios.put<UpdateEmailUser>(`${BASE}/update/email`, User, {
      headers: getRequiredAuthHeaders(),
    })
    return res.data;
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
}

/**
 * Actualiza el perfil del usuario logueado.
 * Si se pasa `photo`, envía multipart/form-data (campo "photo" + Address, PhoneNumber, Birthdate).
 * Si no hay photo, envía JSON.
 */
export async function updateUserProfile(
  payload: UserUpdateMe,
  photo?: File
): Promise<User> {
  try {
    if (photo) {
      const formData = new FormData();
      formData.append("photo", photo);
      if (payload.Address !== undefined && payload.Address !== "")
        formData.append("Address", payload.Address);
      if (payload.PhoneNumber !== undefined && payload.PhoneNumber !== "")
        formData.append("PhoneNumber", payload.PhoneNumber);
      if (payload.Birthdate instanceof Date)
        formData.append("Birthdate", payload.Birthdate.toISOString().slice(0, 10));
      const res = await apiAxios.put<User>(`${BASE}/me`, formData, {
        headers: {
          ...getRequiredAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    }
    const res = await apiAxios.put<User>(`${BASE}/me`, payload, {
      headers: getRequiredAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function getAllUsers(): Promise<User[]> {
  try{
    const res = await apiAxios.get<User[]>(`${BASE}`, {
      headers: getRequiredAuthHeaders(),
    });
    return res.data;
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
  
}

export async function getAllAbonados(): Promise<number> {
  try{
    const res = await apiAxios.get<number>(`${BASE}/role-abonado`, {
      headers: getRequiredAuthHeaders(),
    });
    return res.data;
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
}

export async function deleteUser(id: number): Promise<void> {
  try{
    await apiAxios.delete(`${BASE}/${id}`, {
      headers: getRequiredAuthHeaders(),
    });
  }catch(err){
    console.error(err);
  }
}

//REHACER
export async function createUserModal(user: Omit<RegisterUser, "ConfirmPassword"> & { RoleIds: number[] }) {
  try{
    const { data } = await apiAxios.post(`${BASE}`, user, {
      headers: getRequiredAuthHeaders(),
    });
    return data;
  }catch(err){
    console.error('error');
    return Promise.reject(err);
  }
}

export async function getAllRoles(): Promise<Roles[]> {
  try{
    const { data } = await apiAxios.get<Roles[]>(`/roles`, {
      headers: getRequiredAuthHeaders(),
    });
    return data;
  }catch(err){
    console.log(err);
    return Promise.reject(err);
  }
}

export async function updateUser(id: number, payloads: UpdateUser) : Promise<User>{
  try{
    const res = await apiAxios.put<User>(`${BASE}/${id}`, payloads, {
      headers: getRequiredAuthHeaders(),
    });
    return res.data;
  }catch(err){
    console.log(err);
    return Promise.reject(err);
  }
}

export async function getUserById(id: number) : Promise<User>{
  try{
    const {data} = await apiAxios.get<User>(`${BASE}/${id}`, {
      headers: getRequiredAuthHeaders(),
    });
    return data;
  }catch(err){
    console.error("Error al obtener la informacion del ususario", err);
    return Promise.reject(err);
  }
}

export async function deteleUserById(id: number) : Promise<void>{
  try{
    await apiAxios.delete(`${BASE}/${id}`, {
      headers: getRequiredAuthHeaders(),
    });
  }catch(err){
    console.error("Error al eliminar Usuario", err);
  }
}

export async function searchUsers(params: UsersPaginationParams) {
  try{
    const res = await apiAxios.get<PaginatedResponse<User>>(`${BASE}/search`, {
      params,
      headers: getRequiredAuthHeaders(),
    });
    return res.data;
  }catch(err){
    console.error(err);
    return Promise.reject(err);
  }
  
}

export async function getUserByRoleAdmin () : Promise<User[]>{
  try{
    const {data} = await apiAxios.get<User[]>(`${BASE}/role-admin`, {
      headers: getRequiredAuthHeaders(),
    });
    return data;
  }catch(err){
    return Promise.reject(err);
  }
}

export async function getUsersByRoleFontanero(): Promise<User[]> {
  try {
    const { data } = await apiAxios.get<User[]>(`${BASE}/role-fontanero`, {
      headers: getRequiredAuthHeaders(),
    });
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}
