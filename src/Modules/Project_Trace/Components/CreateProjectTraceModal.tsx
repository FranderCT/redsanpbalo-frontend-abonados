import { useState } from "react";
import { toast } from "react-toastify";
import { ModalBase } from "../../../Components/Modals/ModalBase";
import type { newProjectTrace } from "../Models/ProjectTrace";
import { useCreateProjectTrace } from "../Hooks/ProjectTraceHooks";
import { useForm } from "@tanstack/react-form";

type Props = {
  ProjectId: number;
}

const CreateProjectTraceModal = ({ProjectId} : Props) => {
  const [open, setOpen] = useState(false) // manejar estado de abierto y cerrado
  const handleClose=()=>{
      toast.warning("Seguimiento cancelado",{position:"top-right",autoClose:3000});
      setOpen(false);  
  } // se envia un mensaje que se cerró la creación del seguimineto

  const useCreateProjectTraceMutation = useCreateProjectTrace();

  const form = useForm({
    defaultValues:{
      Name : '',
      Observation : '',
      ProjectId // proviene de las props
    },
    onSubmit: async ({value})=> {

      const projectTracePayloads : newProjectTrace ={
        Name: value.Name,
        Observation: value.Observation,
        ProjectId: ProjectId //-> proviene de las props
      } // datos que espera el project trace

      try{
        await useCreateProjectTraceMutation.mutateAsync(projectTracePayloads);
        toast.success('Seguimineto creado', {position: 'top-right', autoClose: 3000})
        setOpen(false);
        form.reset;
      }catch(err){
        console.error(err);
        toast.error('Error al crear el seguimiento ', {position: 'top-right', autoClose: 3000})
      }
    } // final del onSubmit
  })

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition"
      >
        + Crear seguimiento de proyecto
      </button> {/*Boton para crear un seguimiento*/}
    
      <ModalBase
        open={open}
        onClose={handleClose}
        panelClassName="w-full max-w-xl !p-0 overflow-hidden shadow-2xl"
      >
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="grid gap-3"
        >

          <form.Field name="Name">
            {(field) => (
              <>
                <label className="grid gap-1">
                  <input
                    className="w-full px-4 py-2 bg-gray-50 border"
                    placeholder="Nombre del Seguimineto"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
              </>
            )}
          </form.Field>

          <form.Field name="Observation">
            {(field) => (
              <>
                <label className="grid gap-1">
                  <input
                    className="w-full px-4 py-2 bg-gray-50 border"
                    placeholder="Escriba la observacion a realizar"
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

        </form> {/*final del formulario*/}
      </ModalBase>{/*final del Modal*/}

    </>
  )
}

export default CreateProjectTraceModal