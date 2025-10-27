import type { User } from "../../../Users/Models/User";
import type { CommentRequest } from "../../CommentRequest/Models/CommentRequest";
import type { RequestState } from "../../StateRequest/Model/RequestState";


export interface ReqAvailWater {
  Id: number;
  Justification?: string;
  Date: Date;                       // el backend guarda 'date' (YYYY-MM-DD)
  IdCardFiles: string[];            // simple-array
  PlanoPrintFiles: string[];        // simple-array
  LiteralCertificateFile?: string;
  RequestLetterFile?: string;
  ConstructionPermitFile?: string;
  IsActive: string;

  // Relaciones
  User: User;
  StateRequest: RequestState;
  commentRquest?: CommentRequest[];
}

export interface NewReqAvailWater {
  Justification?: string;
  IdCardFiles: string[];            // requerido por el DTO
  PlanoPrintFiles: string[];        // requerido por el DTO
  LiteralCertificateFile?: string;
  RequestLetterFile?: string;
  ConstructionPermitFile?: string;
  UserId: number;                   // FK (requerido)
  StateRequestId: number;           // FK (requerido)
}

// Estado inicial del formulario (similar a newProjectInitialState)
export const newReqAvailWaterInitialState: NewReqAvailWater = {
  Justification: "",
  IdCardFiles: [],
  PlanoPrintFiles: [],
  LiteralCertificateFile: "",
  RequestLetterFile: "",
  ConstructionPermitFile: "",
  UserId: 0,
  StateRequestId: 0,
};

export interface UpdateReqAvailabilityWater {
  StateRequestId?: number;
}

// Paginación / filtros (manteniendo el estilo del ProjectPaginationParams)
export interface ReqAvailWaterPaginationParams {
  page: number;
  limit: number;
  UserName?: string;          // filtrar por solicitante
  StateRequestId?: number;  // o por ID concreto del estado
  State?: string; 
}
