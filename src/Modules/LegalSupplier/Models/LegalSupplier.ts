import type { Supplier } from "../../Supplier/Models/Supplier";
import type { AgentSupppliers } from "../../Supplier_agent/Models/SupplierAgent";

// export interface LegalSupplier{
//     Id : number;
//     LegalID: string;
//     CompanyName : string;
//     Email : string;
//     PhoneNumber: string;
//     Location: string;
//     WebSite: string;
//     IsActive : boolean
//     AgentSupppliers: AgentSupppliers[]
// }

export interface LegalSupplier {
    Id: number
    Supplier: Supplier
    WebSite: string
    AgentSupppliers?: AgentSupppliers[]
}

export interface newLegalSupplier {
    LegalID?: string;
    CompanyName?: string;
    Email?: string;
    PhoneNumber?: string;
    Location?: string;
    WebSite?: string;
    IsActive? : boolean
}

