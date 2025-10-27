import type { User } from "../../../Users/Models/User";
import type { RequestState } from "../../StateRequest/Model/RequestState";
import type { CommentRequest } from "../../CommentRequest/Models/CommentRequest";

export interface ReqSupervisionMeter{
    Id: number;
    Date: Date;
    Location: string;
    NIS: number;
    Justification : string;
    IsActive: boolean;
    User: User;
    StateRequest:RequestState;
    commentRquest?:CommentRequest[];
}

export interface newReqSupervisionMeter{
    Location: string;
    NIS: number;
    Justification : string;
    UserId: number;
    StateRequestId:number;
}

// Estado inicial del formulario (similar a newInitialState)
export const newReqSupervisionMeterInitialState: newReqSupervisionMeter = {
  Location: "",
  NIS: 0,
  Justification: "",
  UserId: 0,
  StateRequestId: 0,
};

export interface UpdateReqSupervisionMeter {
  StateRequestId?: number;
}

// Paginación / filtros (manteniendo el estilo del ProjectPaginationParams)
export interface ReqSupervisionMeterPaginationParams {
  page: number;
  limit: number;
  UserName?: string;          
  StateRequestId?: number;  
  NIS?:number;
  State?: string; 
}