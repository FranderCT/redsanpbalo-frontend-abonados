export interface RegisterUser{
    Idcard:string;
    Name : string;
    Surname1 : string;
    Surname2 : string;
    Nis: string;
    Email: string;
    PhoneNumber: string;
    BirthDate: Date;
    Address: string;
    Password: string;
    ConfirmPassword: string;
}

export const RegisterUserInitialState: RegisterUser = {
  Idcard: '',
  Name: '',
  Surname1: '',
  Surname2: '',
  Nis: '',
  Email: '',
  PhoneNumber: '',
  BirthDate: new Date,
  Address: '',
  Password: '',
  ConfirmPassword: '',
}
