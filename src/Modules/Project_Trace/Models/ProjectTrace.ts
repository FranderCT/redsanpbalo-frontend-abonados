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
    Date : Date;
    Observation : string; 
    ProjectId : number  
}