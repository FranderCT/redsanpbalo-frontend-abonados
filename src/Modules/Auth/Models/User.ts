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

export const UserInitialState: User = {
  nombre: '',
  apellidos: '',
  cedula: '',
  nis: '',
  email: '',
  telefono: '',
  fechaNacimiento: new Date(),
  password: '',
  confirmPassword: '',
}
