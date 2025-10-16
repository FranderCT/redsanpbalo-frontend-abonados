import type { ReqAvailWater } from "../../RequestAvailabilityWater/Models/ReqAvailWater";

export interface CommentRequest{
    Id : number;
    Subject: string;
    Comment : string;
    requestAvailability : ReqAvailWater;
    // RequestSupervisionMeter:
    // RequestChangeMeter:
    // RequestChangeNameMeter:
    // RequestAssociate:
}

export interface newCommentRequest{
    Subject?: string;
    Comment?: string;
    RequestAvailabilityWaterId?: number;
    RequestSupervisionMeterId?: number;
    RequestChangeMeterId?: number;
    RequestChangeNameMeterId?: number;
    RequestAssociateId?: number;
}


export interface UpdateCommentRequest{
    Subject?: string;
    Comment?: string;
}