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
  Birthdate: new Date(),
  Address: '',
  Password: '',
  ConfirmPassword: '',
  IsAbonado: false,
}