export interface AuditUserRole {
  Id: number;
  Rolname: string;
  Description: string;
}

export interface AuditUserRef {
  Id: number;
  IDcard: string;
  Name: string;
  Surname1: string;
  Surname2: string;
  ProfilePhoto: string | null;
  Nis: number[];
  Email: string;
  PhoneNumber: string;
  Birthdate: string;
  Address: string;
  IsActive: boolean;
  Password?: string;
  Roles?: AuditUserRole[];
}

export interface AuditUserMetadata {
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  source?: string | null;
  context?: Record<string, unknown> | null;
  outcome?: string | null;
  changedFields?: string[] | null;
}

export interface AuditLogActor {
  id: number | null;
  name: string | null;
  email?: string | null;
}

export interface AuditUserRecord {
  Id: number;
  Module: string;
  Action: string;
  EntityName: string;
  EntityId: number | null;
  ActorUserId: number | null;
  TargetUserId: number | null;
  Description: string;
  Metadata: AuditUserMetadata | null;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  ActorUser: AuditUserRef | null;
  TargetUser: AuditUserRef | null;
  TableName?: string | null;
  RecordId?: string | number | null;
  Actor?: AuditLogActor | null;
  AuthorName?: string | null;
  ObjectiveName?: string | null;
}

export interface AuditUsersMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AuditUsersFilters {
  module: string | null;
  entityId: number | null;
  actorUserId: number | null;
  targetUserId: number | null;
  action: string | null;
  startDate: string | null;
  endDate: string | null;
  sortDir: "ASC" | "DESC" | string | null;
}

export interface AuditUsersResponse {
  data: AuditUserRecord[];
  meta: AuditUsersMeta;
  filters?: AuditUsersFilters;
}

export type AuditUsersApiResponse = AuditUsersResponse | AuditUserRecord[] | Record<string, unknown>;
