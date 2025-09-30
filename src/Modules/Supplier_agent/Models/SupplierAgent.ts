export interface SupplierAgent{
    Id: number;
    Name: string;
    Surname1: string;
    Surname2: string;
    Email : string;
    PhoneNumber: string;
    LegalSupplierId: number;
}

export interface newSupplierAgent{
    Name?: string;
    Surname1?: string;
    Surname2?: string;
    Email?: string;
    PhoneNumber?: string;
    LegalSupplierId?: number;
}