import type { Role } from "./Roles";

export interface UserProfile{
    IDcard : string;
    Name : string;
    Surname1 : string;
    Surname2 : string;
    Nis: string;
    Email: string;
    PhoneNumber: string;
    Birthdate: string;
    Address: string;
    Roles : Role[]
}