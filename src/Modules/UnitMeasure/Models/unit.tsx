export interface Unit {
    Id : number
    Name : string;
    IsActive: boolean;
}



export interface NewUnit {
    Name: string
}

export const NewUnitInitialState = {
    Name : ''
}

export interface UnitPaginationParams {
  page: number;
  limit: number;
  name?: string;
  state?: string;
}
