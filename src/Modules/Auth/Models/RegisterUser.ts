import type { Roles } from "../../Users/Models/Roles";

export interface RegisterUser{
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

export type RegisterUserForm = RegisterUser & {
  IsAbonado: boolean;
};

export const RegisterUserInitialState: RegisterUserForm = {
  IDcard: '',
  Name: '',
  Surname1: '',
  Surname2: '',
  Nis: '',
  Email: '',
  PhoneNumber: '',
  Birthdate: '' as unknown as Date,
  Address: '',
  Password: '',
  ConfirmPassword: '',
  IsAbonado: false,
}

export interface createAdminUser{
    IDcard:string;
    Name : string;
    Surname1 : string;
    Surname2 : string;
    Nis: string;
    Email: string;
    PhoneNumber: string;
    Birthdate: Date;
    Address: string;
    roleIds?: number[];
}

export type createAdminUserForm = createAdminUser & {
  IsAbonado: boolean;
};

export const AdminUserInitialState: createAdminUserForm = {
  IDcard: '',
  Name: '',
  Surname1: '',
  Surname2: '',
  Nis: '',
  Email: '',
  PhoneNumber: '',
  Birthdate: '' as unknown as Date,
  Address: '',
  roleIds: [],
  IsAbonado: false
}