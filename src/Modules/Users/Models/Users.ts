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
    BirthDate: string;
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