import type { Role } from "./Roles";


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
    Roles : Role[]
}