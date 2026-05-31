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

export interface PhysicalSupplierPaginationParams {
    page?: number;
    limit?: number;
    name?: string;
    state?: string;
}

// Payload para editar proveedor físico
export interface UpdatePhysicalSupplierDto {
    IDcard?: string;
    Name?: string;
    Surname1?: string;
    Surname2?: string;
    Email?: string;
    PhoneNumber?: string;
    Location?: string;
    IsActive?: boolean;
}

// export interface UpdatePhysicalSupplierDto extends newPhysicalSupplier{
//     IsActive?: boolean;
// }