import type { ProjectState } from "../../Project_State/Models/ProjectState";

export interface Project {
  Id: number;
  Name: string;
  Location: string;
  InnitialDate: Date;
  EndDate: Date;
  Objective:string;
  Description:string;
  Observation:string;
  SpaceOfDocument:string;
  IsActive: boolean;
  ProjectState : ProjectState;
}

export interface newProject{
  Name: string;
  Location: string;
  InnitialDate: Date;
  EndDate: Date;
  Objective:string;
  Description:string;
  Observation:string;
  SpaceOfDocument:string;
  ProjectStateId : number;
}

// Estado inicial del formulario
export const newProjectInitialState: newProject = {
  Name: "",
  Location:"",
  InnitialDate: '' as unknown as Date,
  EndDate: '' as unknown as Date,
  Objective:"",
  Description:"",
  Observation:"",
  SpaceOfDocument:"",
  ProjectStateId : 1
};

export interface ProjectPaginationParams {
  page: number;
  limit: number;
  name?: string;
  state?: string;
}
