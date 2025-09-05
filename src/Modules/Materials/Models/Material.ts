// Models/Material.ts
export interface Material {
  Id: number;
  Name: string;
  Description: string;
  IsActive?: boolean;
  Unit:string;
}

// Para creación (sin Id)
export interface NewMaterial {
  Name: string;
  Description: string;
  IsActive?: boolean;
  Unit:string;
}

// Estado inicial del formulario
export const MaterialInitialState: NewMaterial = {
  Name: "",
  Description: "",
  IsActive: true,
  Unit: ""
};
