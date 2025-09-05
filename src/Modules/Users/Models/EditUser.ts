export interface EditUser{
    // ProfilePhoto?: string;
    Birthdate?: Date;
    PhoneNumber?: string;
    Address?: string;
}

export const EditUserInitialState: EditUser = {
    // ProfilePhoto: '',
    Birthdate: undefined,
    PhoneNumber : undefined,
    Address : undefined
};