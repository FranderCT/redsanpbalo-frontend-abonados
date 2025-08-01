import { useForm } from '@tanstack/react-form';
import { UserInitialState } from '../Models/User';
import { useCreateUser } from '../Hooks/AuthHooks';
import { RegisterSchema } from '../schemas/RegisterSchemas';
import { useNavigate } from '@tanstack/react-router';

const RegisterAbonados = () => {
    const navigate = useNavigate();
    const createUserMutation = useCreateUser();

    const form = useForm({
      defaultValues: UserInitialState,
      validators: {
          onChange: RegisterSchema,
      },
      onSubmit: async ({ value }) => {
        if (value.Password !== value.confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
        await createUserMutation.mutateAsync(value);
        console.log('Usuario creado:', value);
      },
    });

    return (
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-4 mx-auto min-h-screen md:min-h-fit">


        {/* Título para mobile */}
        <div className="md:hidden flex flex-col items-center justify-center mb-4">
          <h1 className="text-4xl font-extrabold text-[#091540]">ASADA</h1>
          <h2 className="text-2xl font-semibold text-[#2F6690]">San Pablo</h2>
        </div>

        {/* Imagen y texto: solo escritorio */}
        <div
          className="hidden md:flex w-1/2 h-auto bg-cover bg-center bg-no-repeat flex-col justify-between items-center px-4 py-8 relative shadow-xl/30"
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
        <div className="w-full md:w-1/2 flex flex-col justify-between items-center h-full overflow-y-auto px-2">
          <div className="flex flex-col justify-center items-center flex-grow w-full">
            <h2 className="text-3xl md:text-5xl font-bold text-[#091540] mb-4 text-center drop-shadow-lg">Crear cuenta</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="w-full max-w-md p-2 flex flex-col gap-3"
            >
              {/* Nombre y Apellidos */}
              <div className="flex gap-2">
                <div className="flex flex-col w-1/2">
                  <form.Field name="nombre">
                    {(field) => (
                      <>
                        <input
                          className="px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                          placeholder="Nombre"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-500 mt-1">
                                {(field.state.meta.errors[0] as any)?.message ??
                                String(field.state.meta.errors[0])}
                            </p>
                        )}
                      </>
                    )}
                  </form.Field>
                </div>

                <div className="flex flex-col w-1/2">
                  <form.Field name="apellidos">
                    {(field) => (
                      <>
                        <input
                          className="px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                          placeholder="Apellidos"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-500 mt-1">
                                {(field.state.meta.errors[0] as any)?.message ??
                                String(field.state.meta.errors[0])}
                            </p>
                        )}
                      </>
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Cédula */}
              <form.Field name="cedula">
                {(field) => (
                  <>
                    <input
                      className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                      placeholder="Cédula"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                              {(field.state.meta.errors[0] as any)?.message ??
                              String(field.state.meta.errors[0])}
                          </p>
                    )}
                  </>
                )}
              </form.Field>

              {/* NIS */}
              <form.Field name="nis">
                {(field) => (
                  <>
                    <input
                      className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                      placeholder="NIS"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 mt-1">
                              {(field.state.meta.errors[0] as any)?.message ??
                              String(field.state.meta.errors[0])}
                          </p>
                    )}
                  </>
                )}
              </form.Field>

              {/* Email */}
              <form.Field name="email">
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
                              {(field.state.meta.errors[0] as any)?.message ??
                              String(field.state.meta.errors[0])}
                          </p>
                    )}
                  </>
                )}
              </form.Field>

              {/* Teléfono */}
              <form.Field name="telefono">
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
                              {(field.state.meta.errors[0] as any)?.message ??
                              String(field.state.meta.errors[0])}
                          </p>
                    )}
                  </>
                )}
              </form.Field>

              {/* Fecha de nacimiento */}
              <form.Field name="fechaNacimiento">
                {(field) => (
                  <>
                    <input
                      type="text"
                      placeholder="Fecha de nacimiento"
                      value={field.state.value}
                      onFocus={(e) => (e.target.type = 'date')}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = 'text';
                      }}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                            {(field.state.meta.errors[0] as any)?.message ??
                            String(field.state.meta.errors[0])}
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
                              {(field.state.meta.errors[0] as any)?.message ??
                              String(field.state.meta.errors[0])}
                          </p>
                    )}
                  </>
                )}
              </form.Field>

              {/* Confirmar Contraseña */}
              <form.Field name="confirmPassword">
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
                              {(field.state.meta.errors[0] as any)?.message ??
                              String(field.state.meta.errors[0])}
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
                      className="w-1/3 bg-[#091540] shadow-xl text-white py-2 rounded-md font-semibold hover:bg-[#1789FC] transition"
                      disabled={!canSubmit}
                    >
                      {isSubmitting ? '...' : 'Registrar'}
                    </button>
                  </div>
                )}
              </form.Subscribe>
            </form>
          </div>

          <p className="mt-4 text-sm md:text-lg text-[#3A7CA5] text-center">
            ¿Ya tenés una cuenta?{' '}
              <button
                onClick={() => navigate({ to: '/auth/login' })}
                className="underline font-medium hover:text-[#091540] cursor-pointer bg-transparent p-0 border-none"
                type="button"
              >
                Inicia sesión aquí
              </button>
          </p>

        </div>
      </div>
    );
};

export default RegisterAbonados;
