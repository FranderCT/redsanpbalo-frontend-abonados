import type { User } from "../../../Users/Models/User";
import type { RequestState } from "../../StateRequest/Model/RequestState";
import type { CommentRequest } from "../../CommentRequest/Models/CommentRequest";

export interface RequestAssociatedFile {
    Id: number;
    FileName: string;
    FilePath: string;
    FileType: string;
    FileSize: number;
    UploadedAt: Date;
}

export interface ReqAssociated{
    Id: number;
    Date: Date;
    Justification : string;
    NIS: number;
    SpaceOfDocument:string|null;
    IsActive: boolean;
    CanComment: boolean;

    // Relaciones 
    User: User;
    StateRequest:RequestState;
    commentRquest?:CommentRequest[];
    RequestAssociatedFile?: RequestAssociatedFile[];
}

export interface newReqAssociated{
    Justification : string;
    NIS: number;
    UserId: number;                  // FK (requerido)
    StateRequestId:number;
}

// Estado inicial del formulario (similar a newInitialState)
export const newReqAssociatedInitialState: newReqAssociated = {
  Justification: "",
  NIS: 0,
  UserId: 0,     
  StateRequestId: 0,              // FK (requerido)
};

export interface UpdateReqAssociated {
  StateRequestId?: number;
  CanComment?: boolean;
}

// Paginación / filtros (manteniendo el estilo del ProjectPaginationParams)
export interface ReqAssociatedPaginationParams {
  page: number;
  limit: number;
  UserName?: string;          
  StateRequestId?: number;  
  State?: string; 
}

export interface ReqAssociatedResponse {
  link?: string;
  url?: string;
  [key: string]: any; // Para capturar cualquier otro formato
}