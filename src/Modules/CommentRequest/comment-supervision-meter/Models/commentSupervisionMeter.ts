import type { ReqSupervisionMeter } from "../../../Requests/RequestSupervisionMeter/Models/ReqSupervisionMeter";
import type { User } from "../../../Users/Models/User";


export interface CommentSupervisionMeter {
  Id: number;
  Subject: string;
  Comment: string;
  createdAt: Date;
  requestsupervisionMeter: ReqSupervisionMeter;
  User: User;
}

export interface CreateCommentSupervisionMeterDto {
  Subject: string;
  Comment: string;
  UserId: number;
}