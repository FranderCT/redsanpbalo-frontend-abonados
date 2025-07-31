export interface User{
    nombre:string,
    apellidos : string,
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
  apellidos: '',
  cedula: '',
  nis: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  Password: '',
  confirmPassword: '',
}
