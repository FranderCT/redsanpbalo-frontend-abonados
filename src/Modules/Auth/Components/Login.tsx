import { useForm } from '@tanstack/react-form'
import { AuthInitialState } from '../Models/Auth';
import { useLogin } from '../Hooks/AuthHooks';


const LoginPrueba = () => {
    const loginMutation = useLogin();

    const form = useForm({
       defaultValues : AuthInitialState,
       onSubmit: async ({value}) => {
        await loginMutation.mutateAsync(value);
        console.log("Usuario logueado:", value);
       } 
    });


  return (
    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 h-auto md:h-[600px] mx-auto">

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
            Inicia Sesión para Continuar
            </p>
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 flex flex-col justify-between items-center h-full">
            <div className="flex flex-col justify-center items-center flex-grow w-full">
            <h2 className="text-3xl md:text-5xl font-bold text-[#091540] mb-6 text-center drop-shadow-lg">Iniciar Sesión</h2>

            <form
                onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
                }}
                className="w-full max-w-md p-2 flex flex-col gap-4"
            >
                <form.Field name="email">
                {(field) => (
                    <input
                    className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                    value={field.state.value}
                    placeholder="Escriba su Correo Electrónico"
                    type="email"
                    onChange={(e) => field.handleChange(e.target.value)}
                    />
                )}
                </form.Field>

                <form.Field name="password">
                {(field) => (
                    <input
                    className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                    placeholder="Escriba su Contraseña"
                    value={field.state.value}
                    type="password"
                    onChange={(e) => field.handleChange(e.target.value)}
                    />
                )}
                </form.Field>

                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                    <div className="flex justify-end">
                    <button
                        type="submit"
                        className="w-1/3 bg-[#091540] shadow-xl text-white py-2 rounded-md font-semibold hover:bg-[#1789FC] transition cursor-pointer"
                        disabled={!canSubmit}
                    >
                        {isSubmitting ? '...' : 'Iniciar sesión'}
                    </button>
                    </div>
                )}
                </form.Subscribe>
            </form>
            </div>

            <p className="mt-6 text-sm md:text-lg text-[#3A7CA5] text-center">
            ¿Ya tenés una cuenta?{' '}
            <a href="/auth/register-abonado" className="underline font-medium hover:text-[#091540] cursor-pointer">
                Registrate aquí
            </a>
            </p>
        </div>
    </div>


  )
}

export default LoginPrueba