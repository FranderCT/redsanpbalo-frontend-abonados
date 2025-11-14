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
    IDcard: string;
    Date: Date;
    Name: string;
    Justification : string;
    Surname1: string;
    Surname2: string;
    NIS: number;
    SpaceOfDocument:string|null;
    IsActive: boolean;
    User: User;
    StateRequest:RequestState;
    commentRquest?:CommentRequest[];
    RequestAssociatedFile?: RequestAssociatedFile[];
}

export interface newReqAssociated{
    IDcard: string;
    Name: string;
    Justification : string;
    Surname1: string;
    Surname2: string;
    NIS: number;
}

// Estado inicial del formulario (similar a newInitialState)
export const newReqAssociatedInitialState: newReqAssociated = {
  IDcard: "",
  Name: "",
  Justification: "",
  Surname1: "",
  Surname2: "",
  NIS: 0,
};

export interface UpdateReqAssociated {
  StateRequestId?: number;
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