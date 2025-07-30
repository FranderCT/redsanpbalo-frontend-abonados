export interface User{
    nombre:string,
    apellidos : string,
    cedula : string,
    nis:string,
    email:string,
    telefono:string,
    fechaNacimiento:Date,
    password:string,
    confirmPassword:string
}

export const UserInitialState = {
    name:'',
    apellidos:'',
    cedula:'',
    nis:'',
    email:'',
    telefono:'',
    fechaNacimiento:'',
    password:'',
    confirmpassword:''
}