export interface userPruebaForm {
  nombre: string;
  apellidos: string;
  cedula: string;
  nis: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  password: string;
  confirmpassword: string;
}

export const userPruebaFormInitialState: userPruebaForm = {
  nombre: '',
  apellidos: '',
  cedula: '',
  nis: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  password: '',
  confirmpassword: ''
}


export interface userPruebaDTO {
  nombre: string;
  apellidos: string;
  cedula: string;
  nis: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  password: string;
}


export const toUserPruebaDTO = (form: userPruebaForm): userPruebaDTO => {
  const { confirmpassword, ...dto } = form
  return dto
}
