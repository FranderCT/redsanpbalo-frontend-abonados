import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { useCreateLegalSupplier } from "../../Hooks/LegalSupplierHooks";


const CreateLegalSupplierModal = () => {
    const [open, setOpen] = useState(false);
    const CreateSupplierMutation = useCreateLegalSupplier();
    const handleClose=()=>{
          toast.warning("Seguimiento cancelado",{position:"top-right",autoClose:3000});
          setOpen(false);
          form.reset();
    } // se envia un mensaje que se cerró la creación del seguimineto
    
    const SPANSTYLES = 'text text-[#222]';
    const LABELSTYLES = 'grid gap-1';
    const INPUTSTYLES= 'w-full px-4 py-2 bg-gray-50 border';


    const form = useForm({
        defaultValues: {
            LegalID: '',
            CompanyName : '',
            Email: '',
            PhoneNumber: '',
            Location: '',
            WebSite: ''
        },
        onSubmit: async ({value}) =>{
            try{
                CreateSupplierMutation.mutateAsync(value);
                form.reset();
                setOpen(false);
            }catch(err){
                console.log('error al crear el proveedor');
            }
        }
    })

  return (
    <>
        <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
        >
            + Crear proveedor jurídico
        </button> {/*Boton para crear un seguimiento*/}

        <ModalBase
            open={open}
            onClose={handleClose}
            panelClassName="w-[min(30vw,700px)] p-4 "
        >
            <header
                className="flex flex-col"
            >
                <h2 className="text-2xl text-[#091540] font-bold">
                    Crear proveedor físico
                </h2>
                <p className="text-md">
                    Complete la información para crear un proveedor físico
                </p>
            </header>

            <div className="border-b border-[#222]/10"></div>

            <form
                onSubmit={(e)=>{
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="grid gap-3"
            >
                <form.Field name='LegalID'>
                    {(field) => (
                    <>
                        <label className={`${LABELSTYLES}`}>
                            <span className={`${SPANSTYLES}`}>
                                Número de cédula jurídica del proveedor
                            </span>
                            <input
                                className={`${INPUTSTYLES}`}
                                placeholder="ejm. 504440503"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </label>
                    </>
                    )}
                </form.Field>

                <form.Field name='CompanyName'>
                    {(field) => (
                    <>
                        <label className={`${LABELSTYLES}`}>
                            <span className={`${SPANSTYLES}`}>
                                Nombre del proveedor
                            </span>
                            <input
                                className={`${INPUTSTYLES}`}
                                placeholder="ejm. Coopecerroazul"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </label>
                    </>
                    )}
                </form.Field>

                <form.Field name='Email'>
                    {(field) => (
                    <>
                        <label className={`${LABELSTYLES}`}>
                            <span className={`${SPANSTYLES}`}>
                                Correo electrónico del proveedor
                            </span>
                            <input
                                className={`${INPUTSTYLES}`}
                                placeholder="ejm. coopecerroazul@gmail.com"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </label>
                    </>
                    )}
                </form.Field>

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

                <form.Field name='Location'>
                    {(field) => (
                    <>
                        <label className={`${LABELSTYLES}`}>
                            <span className={`${SPANSTYLES}`}>
                                Dirección del proveedor
                            </span>
                            <textarea
                                className={`${INPUTSTYLES} resize-none min-h-[70px] leading-relaxed`}
                                placeholder="ejm. 150 metros este del banco nacional en carmona"
                                rows={4} 
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </label>
                    </>
                    )}
                </form.Field>

                <form.Field name='WebSite'>
                    {(field) => (
                    <>
                        <label className={`${LABELSTYLES}`}>
                            <span className={`${SPANSTYLES}`}>
                                Sitio web del proveedor
                            </span>
                            <input
                                className={`${INPUTSTYLES}`}
                                placeholder="ejm. www.coopecerroazul.com"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </label>
                    </>
                    )}
                </form.Field>

                <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                        <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="submit"
                            className="h-10 px-5 bg-[#091540] text-white hover:bg-[#1789FC] disabled:opacity-60"
                            disabled={!canSubmit}
                        >
                            {isSubmitting ? "Registrando…" : "Registrar"}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="h-10 px-4 bg-gray-200 hover:bg-gray-300">
                            Cancelar
                        </button>
                        </div>
                    )}    
                </form.Subscribe>
            
            
            </form>
        </ModalBase>
    </>
  )
}

export default CreateLegalSupplierModal