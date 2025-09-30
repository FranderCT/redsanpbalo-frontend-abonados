export interface LegalSupplier{
    Id : number;
    LegalID: string;
    CompanyName : string;
    Name : string;
    Email : string;
    PhoneNumber: string;
    Location: string;
    WebSite: string;
    IsActive : boolean
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

