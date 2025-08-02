
import { useForm } from '@tanstack/react-form';
// import { AuthInitialState } from '../Models/Auth';
// import { AuthSchema } from '../schemas/AuthSchemas';
// import { toast } from 'react-toastify';
// import { useCreateUser, useLogin } from '../Hooks/AuthHooks';
import { UserInitialState } from '../Models/User';
import { RegisterSchema } from '../schemas/RegisterSchemas';

const ForgotPassword = () => {
    // const createUserMutation = useCreateUser();
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
                //    await createUserMutation.mutateAsync(value);
                   console.log('...', value);
                 },
        }); 
    
      return (
        <div className="bg-white w-full max-w-4xl shadow-lg p-6 flex flex-col md:flex-row gap-6 min-h-screen md:min-h-0 md:h-[600px] mx-auto overflow-y-auto">
    
    
            {/* Título para mobile */}
            <div className="md:hidden flex flex-col items-center justify-center mb-4">
                <h1 className="text-4xl font-extrabold text-[#091540]">ASADA</h1>
                <h2 className="text-2xl font-semibold text-[#2F6690]">San Pablo</h2>
            </div>
    
            {/* Formulario */}
            <div className="w-full flex flex-col justify-between items-center">
                <div className="flex flex-col justify-center items-center flex-grow w-full">
                <h2 className="text-3xl md:text-5xl font-bold text-[#091540] mb-6 text-center drop-shadow-lg">Olvidó su contraseña</h2>
    
                <form
                    onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                    }}
                    className="w-full max-w-md p-2 flex flex-col gap-4"
                >
                    <form.Field name="cedula">
                        {(field) => (
                            <>
                            <input
                                type="text"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Cédula"
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
    
    
                    <form.Field name="email">
                    {(field) => (
                        <>
                            <input
                                className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                                placeholder="Correo electrónico"
                                value={field.state.value}
                                type="email"
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
    
                    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                        <div className="flex flex-row justify-end items-end">
                        <button
                            type="submit"
                            className="w-1/3 bg-[#091540] shadow-xl text-white py-2 rounded-md font-semibold hover:bg-[#1789FC] transition cursor-pointer"
                            disabled={!canSubmit}
                        >
                            {isSubmitting ? '...' : 'Enviar'}
                        </button>
                        </div>
                    )}
                    </form.Subscribe>
                </form>
                </div>
    
                <p className="mt-6 text-sm md:text-lg text-[#3A7CA5] text-center">
                Regresar a {' '}
                <a href="/auth/login" className="underline font-medium hover:text-[#091540] cursor-pointer">
                    Iniciar sesión
                </a>
                </p>
            </div>
        </div>
    
    
    )
}

export default ForgotPassword