
export const TypeDNI = {
  Cedula: 'Cedula',
  Pasaporte: 'Pasaporte',
  Otro: 'Otro',
} as const;

export type TypeDNI = typeof TypeDNI[keyof typeof TypeDNI];

export interface RegisterUser{
    TypeDNI: TypeDNI;
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

export type RegisterUserForm = RegisterUser & {
  IsAbonado: boolean;
};

export const RegisterUserInitialState: RegisterUserForm = {
  TypeDNI: TypeDNI.Cedula,
  IDcard: '',
  Name: '',
  Surname1: '',
  Surname2: '',
  Nis: [],
  Email: '',
  PhoneNumber: '',
  Birthdate: '' as unknown as Date,
  Address: '',
  Password: '',
  ConfirmPassword: '',
  IsAbonado: false,
}

export interface createAdminUser{
    TypeDNI: TypeDNI;
    IDcard:string;
    Name : string;
    Surname1 : string;
    Surname2 : string;
    Nis: number[];
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
  TypeDNI: TypeDNI.Cedula,
  IDcard: '',
  Name: '',
  Surname1: '',
  Surname2: '',
  Nis: [],
  Email: '',
  PhoneNumber: '',
  Birthdate: '' as unknown as Date,
  Address: '',
  roleIds: [],
  IsAbonado: false
}