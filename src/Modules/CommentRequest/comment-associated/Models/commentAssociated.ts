import type { ReqAssociated } from "../../../Requests/RequestAssociated/Models/RequestAssociated";
import type { User } from "../../../Users/Models/User";


export interface CommentAssociated {
  Id: number;
  Subject: string;
  Comment: string;
  hasFileUpdate: boolean;
  createdAt: Date;
  requestAssociated: ReqAssociated;
  Users: User;
  User: User | null;
}

export interface CreateCommentAssociatedDto {
  Subject: string;
  Comment: string;
  UserId: number;
}

export interface CommentAssociatedWithFiles {
  comment: CommentAssociated;
  filesUploaded: number;
  files: RequestAssociatedFile[];
}

export interface RequestAssociatedFile {
  Id: number;
  FileName: string;
  FilePath: string;
  FileType: string;
  FileSize: number;
  UploadedAt: Date;
}