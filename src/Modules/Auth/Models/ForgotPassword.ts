export interface ForgotPassword {
    IDcard : string;
    Email : string;
}

export const ForgotPasswordInitialState : ForgotPassword = {
    IDcard : '',
    Email : ''
}

export interface ForgotPasswordResponse {
    message : string;
}