import { useForm } from '@tanstack/react-form';
import { RegisterUserInitialState} from '../Models/RegisterUser';
import { useCreateUser } from '../Hooks/AuthHooks';
import { RegisterSchema } from '../schemas/RegisterSchemas';
import { toast } from 'react-toastify';
import { Link, useNavigate } from '@tanstack/react-router';

const   RegisterAbonados = () => {
    const createUserMutation = useCreateUser();
    const navigate=useNavigate();
    
    const form = useForm({
      defaultValues: RegisterUserInitialState,
      validators: {
          onChange: RegisterSchema,
      },
      onSubmit: async ({ value }) => {
        if (value.Password !== value.ConfirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
        try{
          const { IsAbonado, ...userData } = value;
          await createUserMutation.mutateAsync(userData);
          console.log('Registro Exitoso');
          toast.success('¡Registro exitoso!', { 
            position: "top-right", 
            autoClose: 3000 
          });
          navigate({ to: '/login' });
          form.reset();
          }catch (error: any){
            console.log('error')
            toast.error('¡Registro denegado!', { 
            position: "top-right", 
            autoClose: 3000 
          });
          form.reset();
          }
      },
    });

    return (
      <div className="grid min-h-screen place-items-center bg-gray-100 p-4">
        <div className="bg-white w-full max-w-4xl h-lvh max-h-[55vh] rounded-2xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 mx-auto ">
          {/* Título para mobile */}
          <div className="md:hidden flex flex-col items-center justify-center mb-4">
            <h1 className="text-4xl font-extrabold text-[#091540]">ASADA</h1>
            <h2 className="text-2xl font-semibold text-[#2F6690]">San Pablo</h2>
          </div>

          {/* Imagen y texto: solo escritorio */}
          <div
            className="hidden md:flex w-1/2 h-full bg-cover bg-center bg-no-repeat flex-col justify-between items-center px-4 py-8 relative shadow-xl/30 rounded-xl"
            style={{ backgroundImage: "url('/Image01.jpg')" }}
          >
            <div className="flex-grow flex items-center justify-center">
              <div className="relative z-10 text-center text-white">
                <h1 className="text-4xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">ASADA</h1>
                <h2 className="text-3xl md:text-5xl font-semibold drop-shadow-lg">San Pablo</h2>
              </div>
            </div>
            <p className="relative z-10 text-white text-sm md:text-base font-medium text-center">
              Registrate para continuar
            </p>
          </div>

          {/* Formulario */}
          <div className="w-full md:w-1/2 flex flex-col h-full items-center">
          {/* Header fijo de la columna derecha */}
            <h2 className="text-xl md:text-3xl font-bold text-[#091540] mb-2 text-center md:text-left drop-shadow-lg">
              Crear cuenta
            </h2>

            <div className="flex-grow overflow-y-auto pr-2">
              <div className="flex flex-col justify-start items-center w-full">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                  className="w-full max-w-md p-2 flex flex-col gap-3"
                >
                  {/* Cédula */}
                  <form.Field name="IDcard">
                    {(field) => (
                      <>
                        <input
                          className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                          placeholder="Cédula"
                          value={field.state.value}
                          onChange={async (e) => {
                            const cedula = e.target.value;
                            field.handleChange(cedula);

                            if (cedula.length >= 9) {
                              try {
                                const res = await fetch(`https://apis.gometa.org/cedulas/${cedula}`);
                                if (!res.ok) throw new Error('No se encontró este numero de cédula');
                                const data = await res.json();

                                if (data?.nombre) {
                                  const partes = data.nombre.trim().split(/\s+/);
                                  const apellido2 = partes.pop() || '';
                                  const apellido1 = partes.pop() || '';
                                  const nombre = partes.join(' '); // El resto es el nombre

                                  form.setFieldValue('Name', nombre);
                                  form.setFieldValue('Surname1', apellido1);
                                  form.setFieldValue('Surname2', apellido2);
                                }
                              } catch (error) {
                                console.warn('Error buscando cédula:', error);
                                form.setFieldValue('Name', '');
                                form.setFieldValue('Surname1', '');
                                form.setFieldValue('Surname2', '');
                              }
                            }
                          }}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>

                  {/* Nombre */}
                  <form.Field name="Name">
                    {(field) => (
                      <>
                        <input
                          className="px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                          placeholder="Nombre"
                          value={field.state.value}
                          disabled
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>

                  {/* Apellidos */}
                  <div className="flex gap-2">
                    <div className="flex flex-col w-1/2">
                      <form.Field name="Surname1">
                        {(field) => (
                          <>
                            <input
                              className="px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                              placeholder="Apellido1"
                              value={field.state.value}
                              disabled
                              onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                              <p className="text-sm text-red-500 mt-1">
                                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                              </p>
                            )}
                          </>
                        )}
                      </form.Field>
                    </div>

                    <div className="flex flex-col w-1/2">
                      <form.Field name="Surname2">
                        {(field) => (
                          <>
                            <input
                              className="px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                              placeholder="Apellido2"
                              value={field.state.value}
                              disabled
                              onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                              <p className="text-sm text-red-500 mt-1">
                                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                              </p>
                            )}
                          </>
                        )}
                      </form.Field>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex flex-col w-1/2 items-center justify-center">
                      {/* Checkbox abonado */}
                      <form.Field name="IsAbonado">
                      {(field) => (
                        <div className="flex items-center space-x-3 mb-2">
                          <label className="group flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.state.value}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.handleChange(checked);
                                if (!checked) {
                                  form.setFieldValue('Nis', '');
                                }
                              }}
                              className="hidden peer"
                            />

                            <span className="relative w-4 h-4 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md shadow-md transition-all duration-500 peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-hover:scale-105">
                              <span className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 opacity-0 peer-checked:opacity-100 rounded-md transition-all duration-500 peer-checked:animate-pulse"></span>

                              <svg
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                className="hidden w-5 h-5 text-white peer-checked:block transition-transform duration-500 transform scale-50 peer-checked:scale-100"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  clipRule="evenodd"
                                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </span>

                            <span className="ml-3 text-gray-700 group-hover:text-blue-500 font-medium transition-colors duration-300">
                              Soy abonado
                            </span>
                          </label>
                        </div>
                      )}
                    </form.Field>
                    </div>
                    <div className="flex flex-col w-1/2">
                    {/* Input NIS */}
                    <form.Field name="Nis">
                      {(field) => {
                        const isAbonado = form.getFieldValue('IsAbonado');
                        const disabled = !isAbonado;
                        return (
                          <>
                            <input
                              className={`w-full px-4 py-2 rounded-md text-sm ${
                                isAbonado
                                  ? 'bg-gray-100 text-[#091540]'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                              placeholder="NIS"
                              value={field.state.value}
                              inputMode="numeric"
                              pattern="\d*"
                              onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, '');
                                field.handleChange(onlyDigits);
                              }}
                              disabled={disabled}
                              aria-disabled={disabled}
                              aria-describedby="nis-help"
                            />

                            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && isAbonado && (
                              <p className="text-sm text-red-500 mt-1">
                                {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                              </p>
                            )}
                          </>
                        );
                      }}
                    </form.Field>
                    </div>
                  </div>
                  {/* Email */}
                  <form.Field name="Email">
                    {(field) => (
                      <>
                        <input
                          className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                          placeholder="Correo electrónico"
                          type="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>

                  {/* Teléfono */}
                  <form.Field name="PhoneNumber">
                    {(field) => (
                      <>
                        <input
                          className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                          placeholder="Número telefónico"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>

                  {/* Fecha de nacimiento */}
                  <form.Field name="Birthdate">
                    {(field) => (
                      <>
                        <input
                          type="date"
                          value={
                            field.state.value instanceof Date
                              ? field.state.value.toISOString().split('T')[0]
                              : ''
                          }
                          onChange={(e) => {
                            field.handleChange(new Date(e.target.value));
                          }}
                          className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>

                  {/* Dirección */}
                  <form.Field name="Address">
                    {(field) => (
                      <>
                        <input
                          className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                          placeholder="Dirección"
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>

                  {/* Contraseña */}
                  <form.Field name="Password">
                    {(field) => (
                      <>
                        <input
                          className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                          placeholder="Contraseña"
                          type="password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>

                  {/* Confirmar Contraseña */}
                  <form.Field name="ConfirmPassword">
                    {(field) => (
                      <>
                        <input
                          className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                          placeholder="Confirmar contraseña"
                          type="password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </>
                    )}
                  </form.Field>

                  {/* Botón de enviar */}
                  <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="w-1/3 bg-[#091540] shadow-xl text-white py-2 rounded-md font-semibold hover:bg-[#1789FC] transition disabled:opacity-60"
                          disabled={!canSubmit}
                        >
                          {isSubmitting ? '...' : 'Registrar'}
                        </button>
                      </div>
                    )}
                  </form.Subscribe>
                </form>
              </div>
            </div>

            {/* Footer fijo (fuera del scroll de inputs) */}
            <p className="mt-3 text-sm md:text-lg text-[#3A7CA5] text-center">
              ¿Ya tenés una cuenta?{' '}
              <Link to="/login" className="underline font-medium hover:text-[#091540] cursor-pointer">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default RegisterAbonados;