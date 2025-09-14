// Models/Material.ts
export interface Material {
  Id: number;
  Name: string;
  IsActive: boolean;
}

export interface newMaterial{
  Name : string;
}

// Estado inicial del formulario
export const newMaterialInitialState: newMaterial = {
  Name: "",
};

export interface updateMaterialDto{
  Name?: string;
  IsActive?: boolean;
}

export const updateMaterialInitialState: updateMaterialDto = {
  Name: undefined,
  IsActive: true,
};

export interface MaterialPaginationParams {
  page: number;
  limit: number;
  name?: string;
  state?: string;
}
