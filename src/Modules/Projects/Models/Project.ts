export interface Project {
  Id: number;
  Name: string;
  Location: string;
  InnitialDate: Date;
  EndDate: Date;
  SpaceOfDocument:string;
  Objective:string;
  Description:string;
  Observation:string;
  IsActive: boolean;
}

export interface newProject{
  Name: string;
  Location: string;
  InnitialDate: Date;
  EndDate: Date;
  SpaceOfDocument:string;
  Objective:string;
  Description:string;
  Observation:string;
}

// Estado inicial del formulario
export const newProjectInitialState: newProject = {
  Name: "",
  Location:"",
  InnitialDate: '' as unknown as Date,
  EndDate: '' as unknown as Date,
  SpaceOfDocument:"",
  Objective:"",
  Description:"",
  Observation:"",
};

export interface ProjectPaginationParams {
  page: number;
  limit: number;
  name?: string;
  state?: string;
}
