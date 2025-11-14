import type { User } from "../../../Users/Models/User";
import type { RequestState } from "../../StateRequest/Model/RequestState";
import type { CommentRequest } from "../../CommentRequest/Models/CommentRequest";

export interface ReqChangeMeter{
    Id: number;
    Date: Date;
    Location: string;
    NIS: number;
    Justification : string;
    IsActive: boolean;
    CanComment: boolean;
    User: User;
    StateRequest:RequestState;
    commentRquest?:CommentRequest[];
}

export interface newReqChangeMeter{
    Location: string;
    NIS: number;
    Justification : string;
    UserId: number;
    StateRequestId:number;
}

// Estado inicial del formulario (similar a newInitialState)
export const newReqChangeMeterInitialState: newReqChangeMeter = {
  Location: "",
  NIS: 0,
  Justification: "",
  UserId: 0,
  StateRequestId: 0,
};

export interface UpdateReqChangeMeterr {
  StateRequestId?: number;
  CanComment?: boolean;
}

// Paginación / filtros (manteniendo el estilo del ProjectPaginationParams)
export interface ReqChangeMeterPaginationParams {
  page: number;
  limit: number;
  UserName?: string;          
  StateRequestId?: number;  
  State?: string; 
}