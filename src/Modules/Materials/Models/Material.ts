// Models/Material.ts
export interface Material {
  Id: number;
  Name: string;
}

export interface newMaterial{
  Name : string;
}

// Estado inicial del formulario
export const newMaterialInitialState: newMaterial = {
  Name: "",
};

