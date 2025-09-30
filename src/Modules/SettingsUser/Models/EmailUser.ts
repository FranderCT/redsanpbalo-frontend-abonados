export interface UpdateEmailUser{
    OldEmail: string;
    NewEmail: string;
}

export const EmailUserInitialState: UpdateEmailUser = {
    OldEmail: '',
    NewEmail: ''
};