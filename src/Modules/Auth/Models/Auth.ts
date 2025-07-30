export interface auth {
    email: string;
    password: string;
}

export const AuthInitialState: auth = {
    email: '',
    password: '',
};