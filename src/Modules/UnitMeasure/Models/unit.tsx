export interface Unit {
  Id: number;
  Name: string;
  IsActive: boolean;
}

export interface NewUnit {
  Name: string;
}

export const NewUnitInitialState = {
  Name: "",
};

export type UnitStateFilter = "all" | "active" | "inactive";

export interface UnitPaginationParams {
  page?: number;
  limit?: number;
  q?: string;
  state?: boolean;
}

export interface UpdateUnitDto {
  Name?: string;
  IsActive?: boolean;
}
