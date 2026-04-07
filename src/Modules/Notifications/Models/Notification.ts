
export interface Notification {
    Id: number;
    Subject: string;
    Message: string;
    IsRead: boolean;
    CreatedAt: Date;
}

export interface CreateNotification {
    Subject: string;
    Message: string;
    User_Role?: string;
}

export const NotificationInitialState: Notification = {
    Id: 0,
    Subject: '',
    Message: '',
    IsRead: false,
    CreatedAt: new Date(),
}
