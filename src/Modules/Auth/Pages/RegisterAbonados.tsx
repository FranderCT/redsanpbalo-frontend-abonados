import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { RegisterUserInitialState } from '../Models/RegisterUser';

import { RegisterSchema } from '../schemas/RegisterSchemas';
import { toast } from 'react-toastify';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCreateAbonado } from '../Hooks/AuthHooks';
import PhoneField from '../../../Components/PhoneNumber/PhoneField';

const RegisterAbonados = () => {
  const [tempNis, setTempNis] = useState('');
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
          shadow-lg
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
            px-4 py-8 relative shadow-xl/30 
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
          <div className="flex-1 min-h-0 px-2 py-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
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
                      className="input-base"
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

                            if (data?.results && data.results.length > 0) {
                              const person = data.results[0];
                              const apellido1 = person.lastname1 || '';
                              const apellido2 = person.lastname2 || '';
                              const fn1 = (person.firstname || '').trim().replace(/\s+/g, ' ');
                              const fn2 = (person.firstname2 || '').trim();
                              const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                              const nombre = fn2 && new RegExp(`\\b${esc(fn2)}\\b`, 'i').test(fn1)
                                ? fn1
                                : [fn1, fn2].filter(Boolean).join(' ').trim();

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
                      className="input-base"
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
                        className="input-base"
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
                        className="input-base"
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

              {/* Soy abonado */}
              <form.Field name="IsAbonado">
                {(field) => (
                  <label className="group flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!field.state.value}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        field.handleChange(checked);
                        if (!checked) {
                          form.setFieldValue('Nis', []);
                          setTempNis('');
                        }
                      }}
                      className="hidden peer"
                    />
                    <span className="relative w-4 h-4 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md transition-all duration-300 peer-checked:border-blue-500 peer-checked:bg-blue-500" />
                    <span className="ml-3 text-gray-700 font-medium duration-300">
                      Soy abonado
                    </span>
                  </label>
                )}
              </form.Field>

              {/* NIS - Array de números */}
              <form.Subscribe selector={(s) => s.values.IsAbonado ?? false}>
                {(isAbonado) => (
                  <form.Field name="Nis">
                    {(field) => {
                      const nisList: number[] = field.state.value ?? [];

                      const addNis = () => {
                        const trimmed = tempNis.trim();
                        if (!trimmed || !/^\d{1,10}$/.test(trimmed)) {
                          toast.error('El NIS debe tener entre 1 y 10 dígitos numéricos');
                          return;
                        }
                        const nisNum = Number(trimmed);
                        if (nisList.includes(nisNum)) {
                          toast.warning('Este NIS ya está agregado');
                          return;
                        }
                        field.handleChange([...nisList, nisNum]);
                        setTempNis('');
                      };

                      const removeNis = (nis: number) => {
                        field.handleChange(nisList.filter(n => n !== nis));
                      };

                      return (
                        <div className="grid gap-2">
                          <span className="text-sm text-gray-700">NIS (Números de identificación)</span>

                          {/* Chips de NIS */}
                          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 border">
                            {nisList.length === 0 && (
                              <span className="text-xs text-gray-400">
                                {isAbonado ? 'Agregue al menos un NIS' : 'Sin NIS asignados'}
                              </span>
                            )}
                            {nisList.map((nis) => (
                              <span
                                key={nis}
                                className="inline-flex items-center gap-2 bg-[#091540] text-white px-3 py-1 text-sm"
                              >
                                {nis}
                                <button
                                  type="button"
                                  onClick={() => removeNis(nis)}
                                  disabled={!isAbonado}
                                  className="hover:text-red-300 font-bold disabled:opacity-50"
                                  title="Eliminar NIS"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>

                          {/* Input para agregar NIS */}
                          {isAbonado && (
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={tempNis}
                                onChange={(e) => setTempNis(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addNis();
                                  }
                                }}
                                placeholder="Ingresa un NIS y presiona Enter"
                                className="flex-1 px-3 py-2 border focus:outline-none focus:ring focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={addNis}
                                className="px-4 py-2 bg-[#1789FC] text-white hover:bg-[#091540] transition-colors"
                              >
                                Agregar
                              </button>
                            </div>
                          )}

                          {field.state.meta.isTouched && field.state.meta.errors.length > 0 && isAbonado && (
                            <p className="text-sm text-red-500 mt-1">
                              {(field.state.meta.errors[0] as any)?.message ?? String(field.state.meta.errors[0])}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  </form.Field>
                )}
              </form.Subscribe>

              {/* Email */}
              <form.Field name="Email">
                {(field) => (
                  <>
                    <input
                      className="input-base"
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
                  <PhoneField
                    value={field.state.value}            
                    onChange={(val) => field.handleChange(val ?? "")} 
                    defaultCountry="CR"
                    required
                    error={
                      field.state.meta.isTouched && field.state.meta.errors[0]
                        ? String(field.state.meta.errors[0])
                        : undefined
                    }
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
                    <span className='text-sm mt-1'>Fecha de nacimiento</span>
                    <input
                      type="date"
                      value={
                        field.state.value instanceof Date && !Number.isNaN(field.state.value.getTime())
                          ? field.state.value.toISOString().slice(0,10)
                          : typeof field.state.value === 'string' ? field.state.value : ''
                      }
                      onChange={(e) => { field.handleChange(new Date(e.target.value)); }}
                      className="input-base"
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
                    <textarea
                      className="input-base"
                      placeholder="Dirección"
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

              {/* Contraseña */}
              <form.Field name="Password">
                {(field) => (
                  <>
                    <input
                      className="input-base"
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
                      className="input-base"
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
                      className="w-full md:w-1/3 bg-[#091540] shadow-xl text-white py-2 font-semibold hover:bg-[#1789FC] transition disabled:opacity-60"
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
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterAbonados;
