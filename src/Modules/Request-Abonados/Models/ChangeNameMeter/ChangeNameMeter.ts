import type { CommentRequest } from "../../../Requests/CommentRequest/Models/CommentRequest";
import type { RequestState } from "../../../Requests/StateRequest/Model/RequestState";
import type { User } from "../../../Users/Models/User";

export interface ChangeNameMeter {
    Id:number;
    Justification: string;
    Date: Date;
    SpaceOfDocument: string | null;
    IsActive: boolean;
    User: User;
    StateRequest: RequestState;
    commentRquest?: CommentRequest[];
    //RequestChangeNameMeterFile: RequestChangeNameMeterFile[];
}

export type PartialChangeNameMeter = Partial<ChangeNameMeter>;
export interface NewChangeNameMeter {
    Justification: string;
    UserId: number;
}