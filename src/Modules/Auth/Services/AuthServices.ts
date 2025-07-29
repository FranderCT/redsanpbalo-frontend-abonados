import axios from "axios";
import type { userPruebaDTO, userPruebaForm } from "../Models/UserPrueba";
import { toUserPruebaDTO } from "../Models/UserPrueba";

export async function registerUser(user: userPruebaForm): Promise<userPruebaDTO> {
  const userData: userPruebaDTO = toUserPruebaDTO(user);
  const response = await axios.post<userPruebaDTO>('/users', userData);
  return response.data;
}
 