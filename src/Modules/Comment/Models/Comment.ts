export interface Comment {
    Id: number;
    Message: string;
    CreatedAt: Date;
    IsRead: boolean;
    IsActive: boolean;
}

export interface NewComment{
    Message: string;
}

export const CommentInitialState: NewComment = {
    Message: '',
}

export type CommentPaginationParams = {
    page?: number;
    limit?: number;
    read?: string;
};

// NUEVO: params para recent-count
export type RecentCountParams = {
  hours?: number;    // p.ej. 24
  days?: number;     // alternativo a hours; si viene, se usa este
  unread?: boolean;  // true = solo no leídos, false = solo leídos
};

// NUEVO: respuesta del recent-count
export type RecentCountResponse = {
  count: number;
  from: string;        // fecha/hora ISO de inicio de ventana
  windowHours: number; // horas efectivas de la ventana
  unread: 'any' | 'true' | 'false';
};