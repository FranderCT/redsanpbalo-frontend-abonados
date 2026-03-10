// Models/Material.ts
export interface Material {
  Id: number;
  Name: string;
  IsActive: boolean;
}

export interface NewMaterial {
  Name : string;
}

// Estado inicial del formulario
export const newMaterialInitialState: NewMaterial = {
  Name: "",
};

export type MaterialStateFilter = "all" | "active" | "inactive";

export interface UpdateMaterialDto{
  Name?: string;
  IsActive?: boolean;
}

export const updateMaterialInitialState: UpdateMaterialDto = {
  Name: undefined,
  IsActive: true,
};

export interface MaterialPaginationParams {
  page?: number;
  limit?: number;
  q?: string;
  state?: boolean;
}
