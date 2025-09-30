export interface AgentSupppliers{
    Id: number;
    Name: string;
    Surname1: string;
    Surname2: string;
    Email : string;
    PhoneNumber: string;
    IsActive: boolean;
}

export interface newAgentSupppliers{
    Name?: string;
    Surname1?: string;
    Surname2?: string;
    Email?: string;
    PhoneNumber?: string;
    LegalSupplierId?: number;
    IsActive?: boolean;
}