import { useForm } from '@tanstack/react-form'
import { UserInitialState } from '../Models/User'
import { useCreateUser } from '../Hooks/AuthHooks';



const RegisterAbonados = () => {
    const createUserMutation = useCreateUser();
    
  const form = useForm({
      defaultValues: UserInitialState,
      onSubmit: async ({ value }) => {
        await createUserMutation.mutateAsync(value);
        console.log("Usuario creado:", value);
      },
    })
  
    return (
    <div className='flex justify-center items-center min-h-screen p-8'>
        <div className="max-w-4xl w-full bg-white bg-opacity-90 shadow-xl/50 flex ">
          
          {/* Lado Izquierdo */}
          <div
            className="w-1/2 bg-cover bg-center relative"
            style={{ backgroundImage: `url('/Image01.jpg')` }}
          >
            <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-between text-white px-4 py-6 h-full">
            <div />
  
            <div className="text-center">
              <h1 className="text-7xl font-extrabold">ASADA</h1>
              <h2 className="text-5xl font-extrabold">San Pablo</h2>
            </div>
              <p className="text-sm">Regístrate para continuar</p>
            </div>
          </div>
  
  
          {/* Lado Derecho - Formulario */}
          <div className="w-1/2 p-8">
            <h1 className="text-2xl font-bold mb-6 text-[#091540] text-center">Crea una cuenta</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-4"
            >
              {/* Nombre */}
              <div className="flex gap-2">
                <form.Field name="nombre">
                  {(field) => (
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="w-1/2 px-3 py-2 bg-gray-100 text-[#091540]"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>
                {/* Apellidos*/}
  
                <form.Field name="apellidos">
                  {(field) => (
                    <input
                      type="text"
                      placeholder="Apellidos"
                      className="w-1/2 px-3 py-2 bg-gray-100 text-[#091540]"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>
              </div>
  
              {/* Cédula */}
              <form.Field name="cedula">
                {(field) => (
                  <input
                    type="text"
                    placeholder="Cédula"
                    className="w-full px-3 py-2 bg-gray-100 text-[#091540]"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(() => (e.target.value))}
                  />
                )}
              </form.Field>

              {/* Nis */}
              <form.Field name="nis">
                {(field) => (
                  <input
                    type="text"
                    placeholder="Nis"
                    className="w-full px-3 py-2 bg-gray-100 text-[#091540]"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(() => (e.target.value))}
                  />
                )}
              </form.Field>
  
              {/* Correo */}
              <form.Field name="email">
                {(field) => (
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full px-3 py-2 bg-gray-100 text-[#091540]"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
  
              {/* Teléfono */}
              <form.Field name="telefono">
                {(field) => (
                  <input
                    type="text"
                    placeholder="Número telefónico"
                    className="w-full px-3 py-2 bg-gray-100 text-[#091540]"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(() => (e.target.value))}
                  />
                )}
              </form.Field>
  
              {/* Fecha de nacimiento */}
              <form.Field name="fechaNacimiento">
                {(field) => (
                  <input
                    type="text"
                    placeholder="Fecha de nacimiento"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text"
                    }}
                    className="w-full px-3 py-2 bg-gray-100 text-[#091540]"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    />
                )}
              </form.Field>
  
              {/* Contraseña */}
              <form.Field name="password">
                {(field) => (
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full px-3 py-2 bg-gray-100 text-[#091540]"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
  
              {/* Confirmar contraseña */}
              <form.Field name="confirmPassword">
                {(field) => (
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    className="w-full px-3 py-2 bg-gray-100 text-[#091540]"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
  
              {/* Botón */}
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <div className='flex justify-end'>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-24 bg-[#091540] text-white py-2 font-semibold hover:bg-[#1789FC] transition"
                  >
                    {isSubmitting ? 'Registrando...' : 'Crear'}
                  </button>
                  </div>
                )}
              </form.Subscribe>
            </form>
  
            {/* Enlace login */}
            <p className="text-center mt-6 text-sm text-[#091540]">
              ¿Ya tenés una cuenta?{' '}
              <a className="text-[#1789FC] hover:underline font-medium cursor-pointer">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
    </div>
    )
}

export default RegisterAbonados