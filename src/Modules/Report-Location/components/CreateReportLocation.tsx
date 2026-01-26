import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/Components/ui/dialog"
import { Button } from "@/Modules/DashboardPrincipal-Abonado/Components/button"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { useCreateReportLocation } from "../hooks/reportLocationHooks"
import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { CreateReportLocationDtoDefatultValues } from "../models/ReportLocation"
import { reportLocatioSchema } from "../schemas/reportLocationSchemas"
import { toast } from "sonner"


const CreateReportLocation = () => {
    const reportLocationMutation = useCreateReportLocation();
    const [open, setOpen] = useState(false);

    const form = useForm({
        defaultValues: 
            CreateReportLocationDtoDefatultValues,
        validators:{
            onChange: reportLocatioSchema
        },
        onSubmit: async ({value}) => {
            try{
                await reportLocationMutation.mutateAsync(value);
                setOpen (false);
                form.reset();
                toast.success('Ubicación creada con éxito',{
                    duration: 4000,
                    position: 'top-right'
                });
            } catch (error) {
                toast.error('Error al crear la ubicación',{
                    duration: 4000,
                    position: 'top-right'
                });
            }   
        }
    })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <Button>
                Crear ubicación
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Crear una nueva ubicación</DialogTitle>
                <DialogDescription>Complete la siguiente información para crear una nueva ubicación</DialogDescription>
            </DialogHeader>

            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateReportLocation