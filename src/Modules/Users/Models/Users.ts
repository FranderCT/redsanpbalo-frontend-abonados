import type { Roles } from "./Roles";



export interface Users{
    Id: number
    IDcard : string;
    Name : string;
    Surname1 : string;
    Surname2 : string;
    Nis: string;
    Email: string;
    PhoneNumber: string;
    Birthdate: string;
    Address: string;
    IsActive : boolean
    Roles : Roles[]
}

export interface RegisterUserModal{
    IDcard:string;
    Name : string;
    Surname1 : string;
    Surname2 : string;
    Nis: string;
    Email: string;
    PhoneNumber: string;
    Birthdate: Date;
    Address: string;
    Password: string;
    ConfirmPassword: string;
}

export type RegisterUserForm = RegisterUserModal & {
  IsAbonado: boolean;
};

export const RegisterUserModalInitialState: RegisterUserForm = {
  IDcard: '',
  Name: '',
  Surname1: '',
  Surname2: '',
  Nis: '',
  Email: '',
  PhoneNumber: '',
  Birthdate: new Date(),
  Address: '',
  Password: '',
  ConfirmPassword: '',
  IsAbonado: false,
}

export interface UserUpdate {
  PhoneNumber : string;
  Address : string;
}

export const updateUserInitialState : UserUpdate = {
  PhoneNumber : '',
  Address : '',
}


// Respuesta paginada (ajústala si tu backend cambia nombres)
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pageCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Parámetros de búsqueda
// Models/PaginationTypes.ts
export interface UsersPaginationParams {
  page: number;
  limit: number;
  name?: string;
  roleName?: string;  // 👈 en vez de roleId
}
