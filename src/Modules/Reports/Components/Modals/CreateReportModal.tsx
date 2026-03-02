import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { FileText } from "lucide-react";
import { useCreateReportByAdmin } from "../../Hooks/ReportsHooks";
import { useGetAllReportStates } from "../../Hooks/ReportStatesHooks";
import { useGetAllReportTypes } from "../../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../../Hooks/ReportLocationHooks";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { useGetUsersByRoleFontanero } from "../../../Users/Hooks/UsersHooks";
import { createReportValidators } from "../../schemas/ReportSchema";

const defaultValues = {
  Location: "",
  Description: "",
  LocationId: 0,
  ReportTypeId: 0,
  ReportStateId: 0,
  UserInChargeId: 0,
};

export default function CreateReportModal() {
  const [open, setOpen] = useState(false);
  const createReportMutation = useCreateReportByAdmin();

  const { reportStates = [], isLoading: statesLoading } = useGetAllReportStates();
  const { reportTypes = [], isLoading: typesLoading } = useGetAllReportTypes();
  const { reportLocations = [], isLoading: locationsLoading } = useGetAllReportLocations();
  const { UserProfile, isLoading: profileLoading } = useGetUserProfile();
  const { fontaneros = [], isPending: fontanerosLoading } = useGetUsersByRoleFontanero();

  const form = useForm({
    defaultValues,
    validators: {
      onChange: createReportValidators,
      onSubmit: createReportValidators,
    },
    onSubmit: async ({ value }) => {
      if (!UserProfile?.Id) {
        toast.error("No se pudo obtener la información del usuario");
        return;
      }

      const payload = {
        Location: value.Location,
        Description: value.Description,
        UserId: UserProfile.Id,
        LocationId: Number(value.LocationId),
        ReportTypeId: Number(value.ReportTypeId),
        ReportStateId: Number(value.ReportStateId),
        UserInChargeId: Number(value.UserInChargeId) || undefined,
      };

      try {
        await createReportMutation.mutateAsync(payload);
        toast.success("¡Reporte creado exitosamente!");
        form.reset();
        setOpen(false);
      } catch (error) {
        toast.error("Error al crear el reporte");
        console.error(error);
      }
    },
  });

  const isLoading = statesLoading || typesLoading || locationsLoading || profileLoading;

  const formatErrors = (errors: unknown[]) =>
    errors?.map((e) =>
      typeof e === "object" && e !== null && "message" in e
        ? { message: (e as { message: string }).message }
        : { message: String(e) }
    );

  const ReportField = form.Field;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <FileText className="size-4" />
          Crear reporte
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden ">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>
            Crear nuevo reporte
          </DialogTitle>
          <DialogDescription>
            Completa la información del reporte para registrarlo en el sistema.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center px-6 py-10">
            <p className="text-sm text-muted-foreground">Cargando información...</p>
          </div>
        ) : (
          <form
            id="create-report-form"
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto overflow-x-hidden px-6 py-4">
              <FieldGroup className="gap-4">
                <ReportField
                  name="Location"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="gap-2"
                      >
                        <FieldLabel htmlFor={field.name}>Ubicación exacta del reporte</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Ej: Calle principal, casa #123"
                        />
                        {isInvalid && (
                          <FieldError errors={formatErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="Description"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Descripción del reporte</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Describe detalladamente el problema..."
                          rows={3}
                          className="resize-none"
                        />
                        {isInvalid && (
                          <FieldError errors={formatErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="LocationId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Barrio del origen del reporte</FieldLabel>
                        <Select
                          value={field.state.value === 0 ? "" : String(field.state.value)}
                          onValueChange={(v) => field.handleChange(Number(v))}
                        >
                          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                            <SelectValue placeholder="Seleccionar barrio" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportLocations.map((loc) => (
                              <SelectItem key={loc.Id} value={String(loc.Id)}>
                                {loc.Neighborhood}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={formatErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="ReportTypeId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Tipo de reporte a realizar</FieldLabel>
                        <Select
                          value={field.state.value === 0 ? "" : String(field.state.value)}
                          onValueChange={(v) => field.handleChange(Number(v))}
                        >
                          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportTypes.map((type) => (
                              <SelectItem key={type.Id} value={String(type.Id)}>
                                {type.Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={formatErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="ReportStateId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Estado en el que se encuentra el reporte</FieldLabel>
                        <Select
                          value={field.state.value === 0 ? "" : String(field.state.value)}
                          onValueChange={(v) => field.handleChange(Number(v))}
                        >
                          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportStates.map((state) => (
                              <SelectItem
                                key={state.IdReportState}
                                value={String(state.IdReportState)}
                              >
                                {state.Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={formatErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="UserInChargeId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>
                          Fontanero encargado (opcional)
                        </FieldLabel>
                        <Select
                          value={String(field.state.value)}
                          onValueChange={(v) => field.handleChange(Number(v))}
                          disabled={fontanerosLoading}
                        >
                          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                            <SelectValue
                              placeholder={
                                fontanerosLoading ? "Cargando..." : "Sin asignar"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">
                              Sin asignar
                            </SelectItem>
                            {fontaneros.map((f) => (
                              <SelectItem key={f.Id} value={String(f.Id)}>
                                {f.Name} {f.Surname1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={formatErrors(field.state.meta.errors)} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              {UserProfile ? (
                <div className="rounded-lg border bg-muted/40 px-4 py-3">
                  <p className="text-sm font-medium text-foreground">
                    Reporte creado por: {UserProfile.Name} {UserProfile.Surname1}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {UserProfile.Email}
                  </p>
                </div>
              ) : null}
            </div>

            <DialogFooter className="flex-row flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <div className="w-full flex flex-col-reverse sm:flex-row-reverse items-center justify-between" >
                    <DialogClose asChild>
                      <Button type="button" variant="outline" className="w-full sm:w-auto">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      form="create-report-form"
                      disabled={!canSubmit || isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? "Creando reporte..." : "Crear reporte"}
                    </Button>
                  </div>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
