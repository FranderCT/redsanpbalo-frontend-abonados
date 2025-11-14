import type { Roles } from "./Roles";
export interface User{
    Id: number
    IDcard : string;
    Name : string;
    Surname1 : string;
    Surname2 : string;
    Nis: number[];
    Email: string;
    PhoneNumber: string;
    Birthdate: Date;
    Address: string;
    IsActive : boolean
    Roles : Roles[]
}

export interface RegisterUserModal{
    IDcard:string;
    Name : string;
    Surname1 : string;
    Surname2 : string;
    Nis: number[];
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
  Nis: [],
  Email: '',
  PhoneNumber: '',
  Birthdate: new Date(),
  Address: '',
  Password: '',
  ConfirmPassword: '',
  IsAbonado: false,
}

export interface UserUpdateMe {
  Birthdate?: Date;
  PhoneNumber?: string;
  Address?: string;
}

export const updateUserMeInitialState : UserUpdateMe = {
  Birthdate : undefined,
  PhoneNumber : '',
  Address : '',
}

export interface UsersPaginationParams {
  page: number;
  limit: number;
  name?: string;
  roleId?: number;
  state?: string;
}

export interface UpdateUser{
    Nis?: number[];
    Email?: string;
    PhoneNumber?: string;
    Birthdate?: Date;
    Address?: string;
    IsActive?: boolean;
    roleIds?: number[];
}

export const updateUserInitialState : UpdateUser = {
  Birthdate : undefined,
  PhoneNumber : '',
  Address : '',
}