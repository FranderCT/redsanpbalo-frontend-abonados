import apiAxios from "@/api/apiConfig";
import type {
  AuditLogActor,
  AuditRecordScope,
  AuditUserMetadata,
  AuditUserRecord,
  AuditUserRef,
  AuditUsersApiResponse,
} from "../Models/AuditUser";
import type { User } from "@/Modules/Users/Models/User";

const AUDIT_LOGS_ENDPOINT = "/audit/logs";
const USERS_ENDPOINT = "/users";
const USER_TABLE_FILTERS = (import.meta.env.VITE_AUDIT_USER_TABLES ?? "users,usuario,usuarios,user")
  .split(",")
  .map((value: string) => value.trim().toLowerCase())
  .filter(Boolean);
const REQUEST_TABLE_FILTERS = (import.meta.env.VITE_AUDIT_REQUEST_TABLES ??
  "request_,request_associated,request_change_meter,request_change_name_meter,request_supervision_meter,request_availability_water")
  .split(",")
  .map((value: string) => value.trim().toLowerCase())
  .filter(Boolean);

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as UnknownRecord) : null;
}

function getFirstDefined<T = unknown>(source: UnknownRecord | null, keys: string[]): T | undefined {
  if (!source) return undefined;

  for (const key of keys) {
    if (key in source) {
      return source[key] as T;
    }
  }

  return undefined;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toStringValue(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => toStringValue(item)).filter(Boolean);
}

function toRecordMap(value: unknown): Record<string, unknown> | null {
  return asRecord(value);
}

function toLowerHaystack(...values: Array<string | null | undefined>): string {
  return values.filter(Boolean).join(" ").toLowerCase();
}

function getNestedUserId(value: Record<string, unknown> | null | undefined): number | null {
  if (!value) return null;

  return (
    toNumber(
      getFirstDefined(value, [
        "UserId",
        "userId",
        "user_id",
        "IdUser",
        "idUser",
        "IdUsuario",
        "idUsuario",
        "usuarioId",
        "associatedUserId",
        "requestUserId",
        "abonadoId",
        "subscriberId",
      ])
    ) ??
    toNumber(getFirstDefined(value, ["TargetUserId", "targetUserId", "target_user_id", "objectiveUserId"])) ??
    null
  );
}

function getNestedUserRef(value: Record<string, unknown> | null | undefined): AuditUserRef | null {
  if (!value) return null;

  const nestedUser =
    asRecord(getFirstDefined(value, ["User", "user", "ObjectiveUser", "objectiveUser", "TargetUser", "targetUser"])) ??
    asRecord(getFirstDefined(value, ["requestUser", "RequestUser", "requester", "Requester", "associatedUser", "abonado", "subscriber"]));

  return normalizeUserRef(nestedUser);
}

function normalizeMetadata(value: unknown, fallbackSource?: string | null): AuditUserMetadata | null {
  const source = asRecord(value);
  if (!source && !fallbackSource) return null;

  return {
    before: toRecordMap(getFirstDefined(source, ["before", "Before", "oldValues", "previous", "old_data"])),
    after: toRecordMap(getFirstDefined(source, ["after", "After", "newValues", "current", "new_data"])),
    source: toStringValue(getFirstDefined(source, ["source", "Source", "module", "origin"]), "") || fallbackSource || null,
    context: toRecordMap(getFirstDefined(source, ["context", "Context", "details", "metadata"])),
    outcome: toStringValue(getFirstDefined(source, ["outcome", "Outcome", "status", "result"]), "") || null,
    changedFields:
      toStringArray(getFirstDefined(source, ["changedFields", "ChangedFields", "fields", "modifiedFields", "changed_columns"])) ||
      null,
  };
}

function inferUnknownActorLabel(source: UnknownRecord | null): string | null {
  const actorDisplayName = toStringValue(
    getFirstDefined(source, ["actorDisplayName", "ActorDisplayName", "authorDisplayName", "AuthorDisplayName"]),
    ""
  ).trim();

  if (actorDisplayName) {
    return actorDisplayName;
  }

  const summary = toStringValue(getFirstDefined(source, ["summary", "Summary"]), "").trim();
  if (summary.toLowerCase().startsWith("actor no identificado")) {
    return "Actor no identificado";
  }

  return null;
}

function normalizeActor(value: unknown): AuditLogActor | null {
  const source = asRecord(value);
  if (!source) return null;

  return {
    id: toNumber(getFirstDefined(source, ["id", "Id", "userId", "actorUserId"])),
    name: toStringValue(getFirstDefined(source, ["name", "Name", "fullName", "username"]), "") || null,
    email: toStringValue(getFirstDefined(source, ["email", "Email"]), "") || null,
  };
}

function normalizeUserRef(value: unknown): AuditUserRef | null {
  const source = asRecord(value);
  if (!source) return null;

  return {
    Id: toNumber(getFirstDefined(source, ["Id", "id"])) ?? 0,
    IDcard: toStringValue(getFirstDefined(source, ["IDcard", "idCard", "cedula"])),
    Name: toStringValue(getFirstDefined(source, ["Name", "name", "firstName"])),
    Surname1: toStringValue(getFirstDefined(source, ["Surname1", "surname1", "lastName", "apellido1"])),
    Surname2: toStringValue(getFirstDefined(source, ["Surname2", "surname2", "secondLastName", "apellido2"])),
    ProfilePhoto: toStringValue(getFirstDefined(source, ["ProfilePhoto", "profilePhoto", "photo"]), "") || null,
    Nis: [],
    Email: toStringValue(getFirstDefined(source, ["Email", "email"])),
    PhoneNumber: toStringValue(getFirstDefined(source, ["PhoneNumber", "phoneNumber", "phone"])),
    Birthdate: toStringValue(getFirstDefined(source, ["Birthdate", "birthdate"])),
    Address: toStringValue(getFirstDefined(source, ["Address", "address"])),
    IsActive: true,
  };
}

function extractDisplayName(value: unknown): string | null {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  const source = asRecord(value);
  if (!source) return null;

  const fullName = toStringValue(
    getFirstDefined(source, ["fullName", "FullName", "displayName", "DisplayName", "name", "Name", "username", "Username"]),
    ""
  ).trim();

  if (fullName) {
    return fullName;
  }

  const composedName = [
    toStringValue(getFirstDefined(source, ["firstName", "FirstName", "Name", "name"]), "").trim(),
    toStringValue(getFirstDefined(source, ["lastName", "LastName", "Surname1", "surname1"]), "").trim(),
    toStringValue(getFirstDefined(source, ["secondLastName", "SecondLastName", "Surname2", "surname2"]), "").trim(),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (composedName) {
    return composedName;
  }

  const email = toStringValue(getFirstDefined(source, ["email", "Email"]), "").trim();
  return email || null;
}

function buildUserRefFromActor(actor: AuditLogActor | null): AuditUserRef | null {
  if (!actor?.name && !actor?.email && actor?.id === null) return null;

  const nameParts = (actor?.name ?? "").trim().split(/\s+/).filter(Boolean);

  return {
    Id: actor?.id ?? 0,
    IDcard: "",
    Name: nameParts[0] ?? actor?.email ?? "Sistema",
    Surname1: nameParts[1] ?? "",
    Surname2: nameParts[2] ?? "",
    ProfilePhoto: null,
    Nis: [],
    Email: actor?.email ?? "",
    PhoneNumber: "",
    Birthdate: "",
    Address: "",
    IsActive: true,
  };
}

function normalizeUserEntity(user: User): AuditUserRef {
  return {
    Id: user.Id,
    IDcard: user.IDcard,
    Name: user.Name,
    Surname1: user.Surname1,
    Surname2: user.Surname2,
    ProfilePhoto: user.ProfilePhoto ?? null,
    Nis: Array.isArray(user.Nis) ? user.Nis : [],
    Email: user.Email,
    PhoneNumber: user.PhoneNumber,
    Birthdate: typeof user.Birthdate === "string" ? user.Birthdate : user.Birthdate?.toString?.() ?? "",
    Address: user.Address,
    IsActive: user.IsActive,
    Roles: Array.isArray(user.Roles)
      ? user.Roles.map((role) => ({
          Id: role.Id,
          Rolname: role.Rolname,
          Description: "",
        }))
      : [],
  };
}

function getDisplayNameFromUser(user: AuditUserRef | null): string | null {
  if (!user) return null;

  const fullName = [user.Name, user.Surname1, user.Surname2].filter(Boolean).join(" ").trim();
  return fullName || user.Email || null;
}

function hasMeaningfulUserIdentity(user: AuditUserRef | null): boolean {
  if (!user) return false;

  const fullName = [user.Name, user.Surname1, user.Surname2].filter(Boolean).join(" ").trim();
  if (fullName && fullName.toLowerCase() !== "sistema") return true;
  if (user.Email?.trim()) return true;
  if (user.IDcard?.trim()) return true;

  return false;
}

function inferDescription(source: UnknownRecord | null, action: string, entityName: string): string {
  return (
    toStringValue(getFirstDefined(source, ["description", "Description", "message", "summary"]), "") ||
    `${action} en ${entityName}`
  );
}

function getCollection(payload: AuditUsersApiResponse): unknown[] {
  const source = asRecord(payload);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(source?.data)) return source.data;
  if (Array.isArray(source?.items)) return source.items;
  if (Array.isArray(source?.results)) return source.results;
  if (Array.isArray(source?.rows)) return source.rows;

  return [];
}

function getAuditScope(tableName: string, moduleName: string, entityName: string): AuditRecordScope {
  const haystack = toLowerHaystack(tableName, moduleName, entityName);

  if (REQUEST_TABLE_FILTERS.some((candidate: string) => haystack.includes(candidate))) {
    return "request";
  }

  if (USER_TABLE_FILTERS.some((candidate: string) => haystack.includes(candidate))) {
    return "user";
  }

  return "other";
}

function inferTargetUserId(source: UnknownRecord | null, metadata: AuditUserMetadata | null): number | null {
  const directTargetUserId = toNumber(
    getFirstDefined(source, [
      "objectiveUserId",
      "ObjectiveUserId",
      "objectUserId",
      "ObjectUserId",
      "targetUserId",
      "TargetUserId",
      "affectedUserId",
      "userId",
      "UserId",
      "idUser",
      "IdUser",
      "idUsuario",
      "IdUsuario",
      "associatedUserId",
      "requestUserId",
      "abonadoId",
      "subscriberId",
    ])
  );

  if (directTargetUserId !== null) {
    return directTargetUserId;
  }

  return (
    getNestedUserId(metadata?.context) ??
    getNestedUserId(metadata?.after) ??
    getNestedUserId(metadata?.before) ??
    null
  );
}

function inferTargetUserRef(source: UnknownRecord | null, metadata: AuditUserMetadata | null): AuditUserRef | null {
  const directTarget = normalizeUserRef(
    getFirstDefined(source, [
      "ObjectiveUser",
      "objectiveUser",
      "ObjectUser",
      "objectUser",
      "TargetUser",
      "targetUser",
      "requestUser",
      "RequestUser",
      "associatedUser",
      "abonado",
      "subscriber",
    ])
  );

  if (directTarget) {
    return directTarget;
  }

  return getNestedUserRef(metadata?.context) ?? getNestedUserRef(metadata?.after) ?? getNestedUserRef(metadata?.before) ?? null;
}

function normalizeAuditRecord(value: unknown, index: number): AuditUserRecord | null {
  const source = asRecord(value);
  if (!source) return null;

  const tableName = toStringValue(getFirstDefined(source, ["tableName", "table", "TableName"]), "");
  const moduleName = toStringValue(getFirstDefined(source, ["module", "Module"]), tableName || "audit");
  const entityName = toStringValue(
    getFirstDefined(source, ["entityName", "EntityName", "resource", "subject"]),
    tableName || "registro"
  );
  const action = toStringValue(getFirstDefined(source, ["action", "Action", "event", "operation"]), "UNKNOWN").toUpperCase();
  const authorValue = getFirstDefined(source, ["author", "Author", "actor", "Actor", "user", "performedBy"]);
  const objectiveValue = getFirstDefined(source, ["objective", "Objective", "target", "Target", "entity"]);
  const actor = normalizeActor(authorValue);
  const actorUser =
    normalizeUserRef(getFirstDefined(source, ["AuthorUser", "authorUser", "ActorUser", "actorUser"])) ??
    buildUserRefFromActor(actor);
  const targetUser = normalizeUserRef(
    getFirstDefined(source, ["ObjectiveUser", "objectiveUser", "ObjectUser", "objectUser", "TargetUser", "targetUser", "target", "entity", "object", "objective"])
  );
  const authorName =
    extractDisplayName(getFirstDefined(source, ["authorName", "AuthorName"])) ??
    extractDisplayName(authorValue) ??
    inferUnknownActorLabel(source);
  const objectiveName =
    extractDisplayName(getFirstDefined(source, ["targetDisplayName", "TargetDisplayName", "objectiveName", "ObjectiveName"])) ??
    extractDisplayName(objectiveValue);
  const metadata = normalizeMetadata(
    {
      before: getFirstDefined(source, ["oldData", "OldData", "before", "Before"]),
      after: getFirstDefined(source, ["newData", "NewData", "after", "After"]),
      changedFields: getFirstDefined(source, ["changedFields", "ChangedFields"]),
      source: tableName || moduleName,
    },
    tableName || moduleName
  );
  const createdAt =
    toStringValue(getFirstDefined(source, ["CreatedAt", "createdAt", "timestamp", "date"])) || new Date(0).toISOString();
  const updatedAt = toStringValue(getFirstDefined(source, ["UpdatedAt", "updatedAt"]), createdAt);
  const recordIdRaw = getFirstDefined(source, ["recordId", "RecordId", "entityId", "EntityId", "objectId", "ObjectId", "objectiveId", "ObjectiveId"]);
  const recordId = typeof recordIdRaw === "string" || typeof recordIdRaw === "number" ? recordIdRaw : null;
  const actorUserId =
    toNumber(getFirstDefined(source, ["authorUserId", "AuthorUserId", "actorUserId", "ActorUserId", "userId"])) ??
    actor?.id ??
    actorUser?.Id ??
    null;
  const scope = getAuditScope(tableName, moduleName, entityName);
  const targetUserRef = targetUser ?? inferTargetUserRef(source, metadata);
  const targetUserId = inferTargetUserId(source, metadata) ?? targetUser?.Id ?? null;

  return {
    Id: toNumber(getFirstDefined(source, ["Id", "id", "auditId"])) ?? index + 1,
    Module: moduleName,
    Action: action,
    EntityName: entityName,
    EntityId: toNumber(recordId),
    ActorUserId: actorUserId,
    TargetUserId: targetUserId,
    Description: inferDescription(source, action, entityName),
    Metadata: metadata,
    IsActive: true,
    CreatedAt: createdAt,
    UpdatedAt: updatedAt,
    ActorUser: actorUser,
    TargetUser: targetUserRef,
    TableName: tableName || null,
    RecordId: recordId,
    Actor: actor,
    AuthorName: authorName,
    ObjectiveName: objectiveName,
    Scope: scope,
  };
}

export async function getAllAuditUsers(): Promise<AuditUserRecord[]> {
  const [{ data: auditLogs }, { data: users }] = await Promise.all([
    apiAxios.get<AuditUsersApiResponse>(AUDIT_LOGS_ENDPOINT),
    apiAxios.get<User[]>(USERS_ENDPOINT),
  ]);

  const usersById = new Map<number, AuditUserRef>(
    users.map((user) => [user.Id, normalizeUserEntity(user)])
  );

  return getCollection(auditLogs)
    .map(normalizeAuditRecord)
    .filter((record): record is AuditUserRecord => record !== null)
    .filter((record) => (record.Scope ?? "other") !== "other")
    .map((record) => {
      const actorFromUsers = record.ActorUserId ? usersById.get(record.ActorUserId) ?? null : null;
      const targetFromUsers = record.TargetUserId ? usersById.get(record.TargetUserId) ?? null : null;

      return {
        ...record,
        ActorUser: hasMeaningfulUserIdentity(record.ActorUser) ? record.ActorUser : actorFromUsers ?? record.ActorUser,
        TargetUser: hasMeaningfulUserIdentity(record.TargetUser) ? record.TargetUser : targetFromUsers ?? record.TargetUser,
        AuthorName: record.AuthorName ?? getDisplayNameFromUser(actorFromUsers),
        ObjectiveName: record.ObjectiveName ?? getDisplayNameFromUser(targetFromUsers),
      };
    })
    .sort((left, right) => new Date(right.CreatedAt).getTime() - new Date(left.CreatedAt).getTime());
}
