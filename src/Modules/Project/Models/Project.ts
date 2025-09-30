import type { ProjectState } from "../../Project_State/Models/ProjectState";
import type { User } from "../../Users/Models/User";
import type { ProjectProjection } from "../Project-projection/Models/ProjectProjection";

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
  ProjectProjection : ProjectProjection;
  User : User;
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
  UserId : number;
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
  ProjectStateId : 1,
  UserId : 1
};

export interface UpdateProject{
  Name?: string;
  Location?: string;
  InnitialDate?: Date;
  EndDate?: Date;
  Objective?:string;
  Description?:string;
  Observation?:string;
  SpaceOfDocument?:string;
  ProjectStateId?: number;
  UserId?: number;
  IsActive?: boolean;
}

export interface ProjectPaginationParams {
  page: number;
  limit: number;
  name?: string;
  state?: string;
  projectState?:string;
}
