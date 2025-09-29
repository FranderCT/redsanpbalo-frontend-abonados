export interface PhysicalSupplier{
    Id : number
    IDcard : string;
    Name : string;
    Email : string;
    PhoneNumber: string;
    Location: string;
    IsActive : boolean;
}

export interface newPhysicalSupplier {
    IDcard? : string;
    Name? : string;
    Email? : string;
    PhoneNumber?: string;
    Location?: string;
    IsActive? : boolean;  
}

