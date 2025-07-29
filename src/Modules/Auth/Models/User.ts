export interface User{
    id?:string,
    name:string,
    surname1:string,
    surname2:string,
    nis:string,
    email:string,
    phonenumber:string,
    dateofbirth:string,
    password:string,
    confirmpassword:string
}

export const UserInitialState = {
    id:'',
    name:'',
    surname1:'',
    surname2:'',
    nis:'',
    email:'',
    phonenumber:'',
    dateofbirth:'',
    password:'',
    confirmpassword:''
}