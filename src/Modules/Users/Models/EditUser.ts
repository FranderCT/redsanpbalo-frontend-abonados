export interface EditUser{
    Birthdate?: Date;
    PhoneNumber?: string;
    Address?: string;
}

export const EditUserInitialState: EditUser = {
    Birthdate: undefined,
    PhoneNumber : '',
    Address : ''
};