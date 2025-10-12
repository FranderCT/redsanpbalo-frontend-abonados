export interface Comment {
    Id: number;
    Message: string;
    IsActive: boolean;
}

export interface NewComment{
    Message: string;
}

export const CommentInitialState: NewComment = {
    Message: '',
}