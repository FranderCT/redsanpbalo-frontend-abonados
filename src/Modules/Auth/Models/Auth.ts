export interface auth {
    Email: string;
    Password: string;
}

export const AuthInitialState: auth = {
    Email: '',
    Password: '',
};