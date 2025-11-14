import type { User } from "../../../Users/Models/User";
import type { RequestState } from "../../StateRequest/Model/RequestState";
import type { CommentRequest } from "../../CommentRequest/Models/CommentRequest";

export interface ReqChangeNameMeter{
    Id: number;
    Justification : string;
    Date:Date;
    SpaceOfDocument:string|null;
    IsActive: boolean;
    CanComment: boolean;
    User: User;
    StateRequest:RequestState;
    commentRquest?:CommentRequest[];
    //RequestChangeNameMeterFile?: RequestChangeNameMeterFile[];
}

export interface newReqChangeNameMeter{
    Justification?: string;
    IsActive?: boolean;
    UserId?: number;
    StateRequestId?:number;
}

// Estado inicial del formulario (similar a newInitialState)
export const newReqChangeMeterInitialState: newReqChangeNameMeter = {
  Justification: "",
  IsActive: true,
  UserId: 0,
  StateRequestId: 0,
};

export interface UpdateReqChangeNameMeter {
  StateRequestId?: number;
  CanComment?: boolean;
}

// Paginación / filtros (manteniendo el estilo del ProjectPaginationParams)
export interface ReqChangeNameMeterPaginationParams {
  page: number;
  limit: number;
  UserName?: string;          
  StateRequestId?: number;  
  State?: string; 
}

export interface ReqChangeNameLinkResponse {
  link?: string;
  url?: string;
  [key: string]: any; // Para capturar cualquier otro formato
}