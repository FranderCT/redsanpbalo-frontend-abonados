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
    <div>
        <form
            onSubmit={(e) =>{
                e.preventDefault();
                form.handleSubmit();
            }}
        >

            <form.Field
                name="email"
            >
                {(field) => (
                    <>
                        <label className="block text-sm font-medium text-[#2F6690]">Email *</label>
                        <input
                            className="w-full px-4 py-2 border border-[#2F6690] rounded-md text-sm text-[#16425B]"
                            value={field.state.value}
                            type='email'
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </>
                )}
            </form.Field>

            <form.Field
                name="password"
            >
                {(field) => (
                    <>
                         <label className="block text-sm font-medium text-[#2F6690]">Password *</label>
                          <input
                            className="w-full px-4 py-2 border border-[#2F6690] rounded-md text-sm text-[#16425B]"
                            value={field.state.value}
                            type='password'
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </>
                )}
                
                
            </form.Field>
            
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                <button
                    type="submit"
                    className="w-full bg-[#3A7CA5] text-white py-2 rounded-lg font-semibold hover:bg-[#2F6690] transition"
                    disabled={!canSubmit}
                >
                    {isSubmitting ? '...' : 'Iniciar sesión'}
                </button>
                )}
          </form.Subscribe>

        </form>
    </div>
  )
}

export default LoginPrueba