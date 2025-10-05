export interface AgentSupppliers{
    Id: number;
    IDcard: string;
    Name: string;
    Surname1: string;
    Surname2: string;
    Email : string;
    PhoneNumber: string;
    IsActive: boolean;
}

export interface newAgentSupppliers{
    IDcard?: string;
    Name?: string;
    Surname1?: string;
    Surname2?: string;
    Email?: string;
    PhoneNumber?: string;
    LegalSupplierId?: number;
    IsActive?: boolean;
}