import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { ModalBase } from "../../../../Components/Modals/ModalBase";
import PhoneField from "../../../../Components/PhoneNumber/PhoneField";
import { useCreateAgentSupplier } from "../../Hooks/SupplierAgentHooks";

type Props ={
    LegalSupplierId? : number;
}

const CreateAgentSupplierModal = ({LegalSupplierId} : Props) => {
    const [open, setOpen] = useState(false);
    const CreateSupplierAgentMutation = useCreateAgentSupplier();
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
            IDcard: '',
            Name: '',
            Surname1 : '',
            Surname2: '',
            Email: '',
            PhoneNumber: '',
            LegalSupplierId
        },
        onSubmit: async ({value}) =>{
            try{
                CreateSupplierAgentMutation.mutateAsync(value);
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
            + Agregar agente
        </button> {/*Boton para crear un seguimiento*/}

        <ModalBase
            open={open}
            onClose={handleClose}
            panelClassName="w-[min(25vw,700px)] p-4 "
        >
            <header
                className="flex flex-col"
            >
                <h2 className="text-2xl text-[#091540] font-bold">
                    Crear agente 
                </h2>
                <p className="text-md">
                    Complete la información para crear un agente
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

                <form.Field name='IDcard'>
                    {(field) => (
                    <>
                        <label className={`${LABELSTYLES}`}>
                            <span className={`${SPANSTYLES}`}>
                                Cédula del agente
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

                <form.Field name='Name'>
                    {(field) => (
                    <>
                        <label className={`${LABELSTYLES}`}>
                            <span className={`${SPANSTYLES}`}>
                                Nombre del agente
                            </span>
                            <input
                                className={`${INPUTSTYLES}`}
                                placeholder="ejm. José"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </label>
                    </>
                    )}
                </form.Field>

                <form.Field name='Surname1'>
                    {(field) => (
                    <>
                        <label className={`${LABELSTYLES}`}>
                            <span className={`${SPANSTYLES}`}>
                                Primer apellido del agente
                            </span>
                            <input
                                className={`${INPUTSTYLES}`}
                                placeholder="ejm. Daniel"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </label>
                    </>
                    )}
                </form.Field>

                <form.Field name='Surname2'>
                    {(field) => (
                    <>
                        <label className={`${LABELSTYLES}`}>
                            <span className={`${SPANSTYLES}`}>
                                Segundo apellido del agente
                            </span>
                            <input
                                className={`${INPUTSTYLES}`}
                                placeholder="ejm. Daniel"
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
                                 Correo electrónico del agente
                            </span>
                            <input
                                className={`${INPUTSTYLES}`}
                                placeholder="ejm. joseroman02@gmail.com"
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

export default CreateAgentSupplierModal