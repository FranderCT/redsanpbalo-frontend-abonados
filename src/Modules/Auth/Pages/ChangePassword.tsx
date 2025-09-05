import { useForm } from "@tanstack/react-form";
import { changePasswordInitialState } from "../Models/changePassword";
import { ChangePasswordSchema } from "../schemas/ChangePasswordSchema";
import { useCreateUser } from "../Hooks/AuthHooks";

const ChangePassword  = () => {
    const createUserMutation = useCreateUser();
    const form = useForm({
           defaultValues: changePasswordInitialState,
                  validators: {
                      onChange: ChangePasswordSchema,
                  },
                 onSubmit: async ({ value }) => {
                   if (value.NewPassword !== value.ConfirmPassword) {
                     alert('Las contraseñas no coinciden');
                     return;
                   }
                //    await createUserMutation.mutateAsync(value);
                   console.log('...', value);
                 },
        }); 
    
return (
        <div className="w-full max-w-md bg-white rounded-sm shadow-lg border-t-20 border-[#091540] px-8 py-10">
            {/* Formulario */}
            <div className="flex flex-col justify-center items-center flex-grow w-full gap-4">
                <h2 className="md:text-3xl font-bold text-[#091540] text-center drop-shadow-lg gap-4">Cambiar su contraseña</h2>
    
                <form
                    onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                    }}
                    className="w-full max-w-md p-2 flex flex-col gap-6"
                >
                    <form.Field name="OldPassword">
                        {(field) => (
                            <>
                            <input
                                type="password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Ingrese su contraseña actual"
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
    
    
                    <form.Field name="NewPassword">
                    {(field) => (
                        <>
                            <input
                                className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                                placeholder="Ingrese su nueva contraseña"
                                value={field.state.value}
                                type="password"
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

                    <form.Field name="ConfirmPassword">
                    {(field) => (
                        <>
                            <input
                                className="w-full px-4 py-2 bg-gray-100 text-[#091540] rounded-md text-sm"
                                placeholder="Confirme su nueva contraseña"
                                value={field.state.value}
                                type="password"
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
                            className="w-1/3 px-4 py-2 bg-[#091540] shadow-xl text-white  rounded-md font-semibold hover:bg-[#1789FC] transition cursor-pointer"
                            disabled={!canSubmit}
                        >
                            {isSubmitting ? '...' : 'Enviar'}
                        </button>
                        </div>
                    )}
                    </form.Subscribe>
                </form>
                </div>

        </div>
    
    )
}

export default ChangePassword