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