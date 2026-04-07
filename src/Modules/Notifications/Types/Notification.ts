import type { CreateNotification as CreateNotificationModel } from "../Models/Notification";

export type Notification = {
  id: string;
  subject: string;
  description: string;
  date: string;
  status: "READ" | "UNREAD" | "URGENT";
  targetRoleId?: number;
  targetRoleName?: string;
};

export type NotificationFilter = "ALL" | "READ" | "UNREAD";

export type CreateNotificationPayload = CreateNotificationModel;

export const ALL_ROLES_OPTION_ID = -1;
export const ALL_ROLES_OPTION_NAME = "Todos los roles";

export type NotificationApiResponse = {
  id?: string | number;
  Id?: string | number;
  subject?: string;
  Subject?: string;
  description?: string;
  Description?: string;
  message?: string;
  Message?: string;
  date?: string;
  Date?: string;
  createdAt?: string;
  CreatedAt?: string;
  isRead?: boolean;
  IsRead?: boolean;
  status?: Notification["status"];
  Status?: Notification["status"];
  UserNotifications?: Array<{
    id?: string | number;
    Id?: string | number;
    isRead?: boolean;
    IsRead?: boolean;
  }>;
  Notification?: {
    id?: string | number;
    Id?: string | number;
    subject?: string;
    Subject?: string;
    description?: string;
    Description?: string;
    message?: string;
    Message?: string;
    date?: string;
    Date?: string;
    createdAt?: string;
    CreatedAt?: string;
    status?: Notification["status"];
    Status?: Notification["status"];
  };
  Is_Read?: boolean;
};
