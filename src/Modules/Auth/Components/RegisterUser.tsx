
import { useForm } from '@tanstack/react-form'
import { UserInitialState } from '../Models/User'


const RegisterUser = () => {
  const form = useForm({
    defaultValues: UserInitialState,
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <div className='flex justify-center items-center min-h-screen p-8'>
      <div className="max-w-4xl w-full bg-white bg-opacity-90 shadow-xl/50 flex ">
        
        {/* Lado Izquierdo */}
        <div
          className="w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url('/Image01.jpg')`}}
        >
          <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-between text-white py-10">
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
              <form.Field name="name">
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

              <form.Field name="surname1">
                {(field) => (
                  <input
                    type="text"
                    placeholder="Apellidos"
                    className="w-1/2 px-3 py-2 bg-gray-100 text-[#091540]"
                    id={field.name}
                    name={field.name}
                    value={`${form.getFieldValue('surname1')} ${form.getFieldValue('surname2')}`}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const [s1, ...rest] = e.target.value.trim().split(' ')
                      const s2 = rest.join(' ')
                      form.setFieldValue('surname1', s1)
                      form.setFieldValue('surname2', s2)
                    }}
                  />
                )}
              </form.Field>
            </div>

            {/* Cédula */}
            <form.Field name="id">
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
            <form.Field name="phonenumber">
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
            <form.Field name="dateofbirth">
              {(field) => (
                <input
                  type="text"
                  placeholder="Fecha nacimiento"
                  className="w-full px-3 py-2 bg-gray-100 text-[#091540]"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
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
            <form.Field name="confirmpassword">
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

export default RegisterUser

