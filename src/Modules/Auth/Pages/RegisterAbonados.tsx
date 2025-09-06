import { useForm } from '@tanstack/react-form';
import { RegisterUserInitialState } from '../Models/RegisterUser';

import { RegisterSchema } from '../schemas/RegisterSchemas';
import { toast } from 'react-toastify';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCreateAbonado } from '../Hooks/AuthHooks';

const RegisterAbonados = () => {
  const createUserMutation = useCreateAbonado();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: RegisterUserInitialState,
    validators: { onChange: RegisterSchema },
    onSubmit: async ({ value }) => {
      if (value.Password !== value.ConfirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      try {
        const { IsAbonado, ...userData } = value;
        await createUserMutation.mutateAsync(userData);
        toast.success('¡Registro exitoso!', { position: 'top-right', autoClose: 3000 });
        navigate({ to: '/login' });
        form.reset();
      } catch (error: any) {
        console.log('error', error);
        toast.error('¡Registro denegado!', { position: 'top-right', autoClose: 3000 });
        form.reset();
      }
    },
  });

  return (
    <div className="grid min-h-svh place-items-center bg-gray-100 p-4 overflow-x-hidden">
      <div
        className="
          bg-white w-full
          max-w-[560px] md:max-w-4xl
          rounded-2xl shadow-lg
          p-4 md:p-6
          flex flex-col md:flex-row gap-4 md:gap-6
          mx-auto
          overflow-hidden
          md:h-[600px]
        "
      >
        {/* Título mobile */}
        <div className="md:hidden flex flex-col items-center justify-center mb-2">
          <h1 className="text-4xl font-extrabold text-[#091540]">ASADA</h1>
          <h2 className="text-2xl font-semibold text-[#2F6690]">San Pablo</h2>
        </div>

        {/* Panel imagen (solo desktop) */}
        <div
          className="
            hidden md:flex
            basis-1/2 shrink-0
            bg-cover bg-center bg-no-repeat
            flex-col justify-between items-center
            px-4 py-8 relative shadow-xl/30 rounded-xl
          "
          style={{ backgroundImage: "url('/Image01.jpg')" }}
        >
          <div className="flex-grow flex items-center justify-center">
            <div className="relative z-10 text-center text-white">
              <h1 className="text-4xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">ASADA</h1>
              <h2 className="text-3xl md:text-5xl font-semibold drop-shadow-lg">San Pablo</h2>
            </div>
          </div>
          <p className="relative z-10 text-white text-sm md:text-base font-medium text-center">
            Regístrese para continuar
          </p>
        </div>

        {/* Columna formulario */}
        <div
          className="
            basis-full md:basis-1/2
            flex flex-col items-center
            min-w-0
          "
        >
          <h2 className="text-xl md:text-3xl font-bold text-[#091540] mb-2 text-center md:text-left drop-shadow-lg">
            Crear cuenta
          </h2>

          {/* En móvil deja scrollear a la página; en desktop, esta columna scrollea */}
          <div className="w-full min-w-0 md:flex md:flex-col md:flex-1 md:overflow-y-auto md:pr-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="w-full max-w-md p-2 flex flex-col gap-3 min-w-0 mx-auto"
            >
              {/* Cédula */}
              <form.Field name="IDcard">
                {(field) => (
                  <>
                    <input
                      className="w-full max-w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                      placeholder="Cédula"
                      value={field.state.value}
                      onChange={async (e) => {
                        const cedula = e.target.value;
                        field.handleChange(cedula);

                        if (cedula.length >= 9) {
                          try {
                            const res = await fetch(`https://apis.gometa.org/cedulas/${cedula}`);
                            if (!res.ok) throw new Error('No se encontró este número de cédula');
                            const data = await res.json();

                            if (data?.nombre) {
                              const partes = data.nombre.trim().split(/\s+/);
                              const apellido2 = partes.pop() || '';
                              const apellido1 = partes.pop() || '';
                              const nombre = partes.join(' ');

                              form.setFieldValue('Name', nombre);
                              form.setFieldValue('Surname1', apellido1);
                              form.setFieldValue('Surname2', apellido2);
                            }
                          } catch (err) {
                            console.warn('Error buscando cédula:', err);
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
                      className="w-full max-w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
                <form.Field name="Surname1">
                  {(field) => (
                    <>
                      <input
                        className="w-full max-w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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

                <form.Field name="Surname2">
                  {(field) => (
                    <>
                      <input
                        className="w-full max-w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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

              {/* Soy abonado + NIS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
                <form.Field name="IsAbonado">
                  {(field) => (
                    <label className="group flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={field.state.value}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          field.handleChange(checked);
                          if (!checked) form.setFieldValue('Nis', '');
                        }}
                        className="hidden peer"
                      />
                      <span className="relative w-4 h-4 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md transition-all duration-300 peer-checked:border-blue-500 peer-checked:bg-blue-500" />
                      <span className="ml-3 text-gray-700 group-hover:text-blue-500 font-medium transition-colors duration-300">
                        Soy abonado
                      </span>
                    </label>
                  )}
                </form.Field>

                <form.Field name="Nis">
                  {(field) => {
                    const isAbonado = form.getFieldValue('IsAbonado');
                    const disabled = !isAbonado;
                    return (
                      <>
                        <input
                          className={`w-full max-w-full px-4 py-2 rounded-md text-sm ${
                            isAbonado ? 'bg-gray-100 text-[#091540]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          placeholder="NIS"
                          value={field.state.value}
                          inputMode="numeric"
                          pattern="\d*"
                          onChange={(e) => field.handleChange(e.target.value.replace(/\D/g, ''))}
                          disabled={disabled}
                          aria-disabled={disabled}
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

              {/* Email */}
              <form.Field name="Email">
                {(field) => (
                  <>
                    <input
                      className="w-full max-w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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
                      className="w-full max-w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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
                        field.state.value
                          ? (field.state.value instanceof Date
                              ? field.state.value.toISOString().split('T')[0]
                              : String(field.state.value))
                          : ''
                      }
                      onChange={(e) => { field.handleChange(new Date(e.target.value)); }}
                      className="w-full max-w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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
                      className="w-full max-w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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
                      className="w-full max-w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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

              {/* Confirmar contraseña */}
              <form.Field name="ConfirmPassword">
                {(field) => (
                  <>
                    <input
                      className="w-full max-w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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

              {/* Botón */}
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <div className="flex flex-col md:flex-row md:justify-end">
                    <button
                      type="submit"
                      className="w-full md:w-1/3 bg-[#091540] shadow-xl text-white py-2 rounded-md font-semibold hover:bg-[#1789FC] transition disabled:opacity-60"
                      disabled={!canSubmit}
                    >
                      {isSubmitting ? '...' : 'Registrar'}
                    </button>
                  </div>
                )}
              </form.Subscribe>
            </form>
          </div>

          {/* Footer */}
          <p className="mt-3 text-sm md:text-lg text-[#091540] text-center">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="underline text-[#1789FC] font-medium hover:text-[#091540] cursor-pointer">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterAbonados;
