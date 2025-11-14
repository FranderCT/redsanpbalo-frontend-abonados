import type { AgentSupppliers } from "../../Supplier_agent/Models/SupplierAgent";

export interface Supplier {
    Id: number;
    IDcard: string;
    Name: string;
    Email: string;
    PhoneNumber: string;
    Location: string;
    IsActive: boolean;
    Type: "LEGAL" | "PHYSICAL";
}

export interface LegalSupplier{
    Id : number;
    Supplier: Supplier;
    WebSite: string;
    AgentSupppliers?: AgentSupppliers[]
}

export interface newLegalSupplier {
    LegalID?: string;
    CompanyName?: string;
    Email?: string;
    PhoneNumber?: string;
    Location?: string;
    WebSite?: string;
    IsActive?: boolean;
}

