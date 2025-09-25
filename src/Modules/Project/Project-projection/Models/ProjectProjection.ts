import type { Project } from "../../Models/Project";

export interface ProjectProjection { 
    Id : number;
    Observation : string;
    Project : Project
}


export interface NewProjectProjection {
    Observation : string;
    ProjectId : number;
}


export const NewProjectProjectionInitialState : NewProjectProjection = {
    Observation : '',
    ProjectId : 0
}