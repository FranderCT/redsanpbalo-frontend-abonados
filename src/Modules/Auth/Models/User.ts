export interface User{
    nombre:string,
    surname1 : string,
    surname2 : string,
    cedula : string,
    nis:string,
    email:string,
    telefono:string,
    fechaNacimiento:string,
    Password:string,
    confirmPassword:string
}

export const UserInitialState: User = {
  nombre: '',
  surname1: '',
  surname2: '',
  cedula: '',
  nis: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  Password: '',
  confirmPassword: '',
}
