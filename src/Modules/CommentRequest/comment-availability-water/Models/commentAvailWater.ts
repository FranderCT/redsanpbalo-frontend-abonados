import type { ReqAvailWater } from "../../../Requests/RequestAvailabilityWater/Models/ReqAvailWater";
import type { User } from "../../../Users/Models/User";


export interface CommentAvailabilityWater {
  Id: number;
  Subject: string;
  Comment: string;
  createdAt: Date;
  requestAvailability: ReqAvailWater;
  User: User;
}

export interface CreateAdminCommentDto {
  Subject: string;
  Comment: string;
  UserId: number;
}

export interface ReplyWithFilesDto {
  Subject: string;
  Comment: string;
  UserId: number;
}

export interface CommentAvailabilityWaterWithFiles {
  comment: CommentAvailabilityWater;
  filesUploaded: number;
  files: RequestAvailabilityWaterFile[];
}

export interface RequestAvailabilityWaterFile {
  Id: number;
  FileName: string;
  FilePath: string;
  FileType: string;
  FileSize: number;
  UploadedAt: Date;
}