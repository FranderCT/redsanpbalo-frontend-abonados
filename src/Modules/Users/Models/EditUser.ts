export interface EditUser{
    BirthDate: string;
    PhoneNumber: string;
    Address: string;
}

export const EditUserInitialState: EditUser = {
    BirthDate : '',
    PhoneNumber : '',
    Address : ''
};