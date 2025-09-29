import type { Project } from "../../Project/Models/Project";

export interface ProjectTrace {
    Id : number;
    Name : string;
    Date : Date;
    Observation : string;
    IsActive : boolean;
    Project : Project
}

export interface newProjectTrace {
    Name : string;
    Observation : string; 
    ProjectId : number  
}