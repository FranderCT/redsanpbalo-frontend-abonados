// Objeto Supplier anidado que viene del backend
export interface Supplier {
    Id: number;
    IDcard: string;
    Name: string;
    Email: string;
    PhoneNumber: string;
    Location: string;
    IsActive: boolean;
    Type: string;
}

// Respuesta de paginación con estructura anidada
export interface PhysicalSupplier {
    Id: number;
    Supplier: Supplier | null;
    Surname1: string;
    Surname2: string;
}

// Payload para crear proveedor físico
export interface newPhysicalSupplier {
    IDcard?: string;
    Name?: string;
    Surname1?: string;
    Surname2?: string;
    Email?: string;
    PhoneNumber?: string;
    Location?: string;
}

// Payload para editar proveedor físico
export interface editPhysicalSupplier {
    IDcard?: string;
    Name?: string;
    Surname1?: string;
    Surname2?: string;
    Email?: string;
    PhoneNumber?: string;
    Location?: string;
    IsActive?: boolean;
}