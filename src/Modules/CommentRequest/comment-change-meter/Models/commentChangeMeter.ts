import type { ReqChangeMeter } from "../../../Requests/RequestChangeMeterr/Models/RequestChangeMeter";
import type { User } from "../../../Users/Models/User";

export interface CommentChangeMeter {
  Id: number;
  Subject: string;
  Comment: string;
  createdAt: Date;
  requestChangeMeter: ReqChangeMeter;
  User: User;
}

export interface CreateCommentChangeMeterDto {
  Subject: string;
  Comment: string;
  UserId: number;
}

// // Si en el futuro agregas respuesta con archivos
// export interface CommentChangeMeterWithFiles {
//   comment: CommentChangeMeter;
//   filesUploaded: number;
//   files: RequestChangeMeterFile[];
// }

// export interface RequestChangeMeterFile {
//   Id: number;
//   FileName: string;
//   FilePath: string;
//   FileType: string;
//   FileSize: number;
//   UploadedAt: Date;
// }