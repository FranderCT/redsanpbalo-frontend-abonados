export interface changePassword {
    OldPassword : string;
    NewPassword:  string;
    ConfirmPassword: string
}

export const changePasswordInitialState : changePassword = {
    OldPassword : '',
    NewPassword : '',
    ConfirmPassword: ''
}