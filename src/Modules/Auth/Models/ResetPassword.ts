
export interface ResetPassword {
    NewPassword : string;
    ConfirmPassword : string;
}

export const ResetPasswordInitialState : ResetPassword = {
    NewPassword : '',
    ConfirmPassword : ''
}