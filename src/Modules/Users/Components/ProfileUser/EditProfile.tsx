import { useForm } from "@tanstack/react-form";
import { UserInitialState } from "../../../Auth/Models/User";
import { RegisterSchema } from "../../../Auth/schemas/RegisterSchemas";

const EditProfile = () => {
  //const createUserMutation = useCreateUser();
    const form = useForm({
           defaultValues: UserInitialState,
                 validators: {
                     onChange: RegisterSchema,
                    },
                      onSubmit: async ({ value }) => {
                      console.log('...', value);
                    },
        }); 
      return (
        <div className="bg-[#F9F5FF] flex flex-col content-center w-full max-w-6xl mx-auto px-4 md:px-25 pt-24 pb-20 gap-8">
            <div>
              <h1 className="text-2xl font-bold text-[#091540]">Editar información del perfil</h1>
              <h3 className="text-[#091540]/70 text-md">Modifique aquí los datos de su perfil</h3>
              <div className="border-b border-dashed border-gray-300 p-2"></div>
            </div>
            {/* Formulario */}
            <div className="w-full max-w-md mx-auto flex flex-col items-center border border-gray-200 gap-4 shadow-xl rounded-sm bg-[#F9F5FF] p-6">
                <h2 className="md:text-2xl font-bold text-[#091540] text-center gap-4">Frander Carrillo Torres</h2>
                <img
                src="/Image02.png"
                className="w-40 h-40 rounded-full object-cover border border-gray-200"/>
                <a  href="/profile" className="flex flex-row items-center gap-2 text-[#091540]">Editar foto de perfil {/* ícono lápiz */} <svg width="16" height="16" viewBox="0 0 24 24" fill="none"> <path d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25z" stroke="#091540" /> <path d="M14.06 5.19l3.75 3.75" stroke="#091540" /> </svg></a>
                <form
                    onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                    }}
                    className="w-full max-w-md p-2 flex flex-col gap-6"
                >
                    <form.Field name="fechaNacimiento">
                      {(field) => (
                        <>
                          <input
                            type="date"
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

                    <form.Field name="Address">
                      {(field) => (
                        <>
                          <input
                            className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
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
    
                    <div className='flex justify-end gap-4 '>
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            className="bg-[#091540] hover:bg-blue-600 text-white text-shadow-lg/30 font-semibold w-25 rounded"
                            disabled={!canSubmit}
                        >
                            {isSubmitting ? '...' : 'Confirmar'}
                        </button>
                    )}
                    </form.Subscribe>
                      <button
                      type="button"
                      //onClick={() => navigate('/auth/login')}
                      className="bg-[#F6132D] hover:bg-red-700 text-white text-shadow-lg/30 font-semibold w-25 p-2 rounded-sm"
                      >
                      Cancelar
                      </button>
                    </div>
                </form>
              </div>
        </div>
  )
}

export default EditProfile