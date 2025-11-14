import type { ReqChangeNameMeter } from "../../../Requests/RequestChangeNameMeter/Models/RequestChangeNameMeter";
import type { User } from "../../../Users/Models/User";


export interface CommentChangeNameMeter {
  Id: number;
  Subject: string;
  Comment: string;
  createdAt: Date;
  requestChangeNameMeter: ReqChangeNameMeter;
  User: User;
}

export interface CreateCommentChangeNameMeterDto {
  Subject: string;
  Comment: string;
  UserId: number;
}

export interface ReplyWithFilesDto {
  Subject: string;
  Comment: string;
  UserId: number;
}

export interface CommentChangeNameMeterWithFiles {
  comment: CommentChangeNameMeter;
  filesUploaded: number;
  files: RequestChangeNameMeterFile[];
}

export interface RequestChangeNameMeterFile {
  Id: number;
  FileName: string;
  FilePath: string;
  FileType: string;
  FileSize: number;
  UploadedAt: Date;
}