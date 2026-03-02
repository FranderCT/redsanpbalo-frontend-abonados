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
} from "@/Components/ui/dialog";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/Components/ui/field";

import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useCreateReportByUser } from "../../Hooks/ReportsHooks";
import { useGetAllReportTypes } from "../../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../../Hooks/ReportLocationHooks";
import { useGetUserProfile } from "../../../Users/Hooks/UsersHooks";
import { createReportUserValidators } from "../../schemas/ReportSchema";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";    


type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const defaultValues = {
  Location: "",
  Description: "",
  LocationId: 0,
  ReportTypeId: 0,
};

export default function CreateReportUserModal({ open, setOpen }: Props) {
  const createReportMutation = useCreateReportByUser();

  const { reportTypes = [], isLoading: typesLoading } = useGetAllReportTypes();
  const { reportLocations = [], isLoading: locationsLoading } =
    useGetAllReportLocations();
  const { UserProfile, isLoading: profileLoading } = useGetUserProfile();

  const form = useForm({
    defaultValues,
    validators: {
      onChange: createReportUserValidators,
      onSubmit: createReportUserValidators,
    },
    onSubmit: async ({ value }) => {
      if (!UserProfile?.Id) {
        toast.error("Debes estar logueado para crear un reporte");
        return;
      }

      const payload = {
        Location: value.Location,
        Description: value.Description,
        UserId: UserProfile.Id,
        LocationId: Number(value.LocationId),
        ReportTypeId: Number(value.ReportTypeId),
        ReportStateId: 1,
        UserInChargeId: undefined,
      };

      try {
        await createReportMutation.mutateAsync(payload);
        toast.success("¡Reporte creado exitosamente! Será revisado por nuestro equipo.");
        form.reset();
        setOpen(false);
      } catch (error) {
        toast.error("Error al crear el reporte");
        console.error(error);
      }
    },
  });

  const isLoading = typesLoading || locationsLoading || profileLoading;

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
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Crear nuevo reporte</DialogTitle>
          <DialogDescription>
            Reporta un problema en tu zona. Completa la información para que nuestro equipo pueda atenderte.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center px-6 py-10">
            <p className="text-sm text-muted-foreground">Cargando información...</p>
          </div>
        ) : !UserProfile?.Id ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 px-6 py-10">
            <p className="text-center text-sm text-muted-foreground">
              Debes estar logueado para crear un reporte
            </p>
          </div>
        ) : (
          <form
            id="create-report-user-form"
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
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>
                          Ubicación específica
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Ej: Calle principal, casa #123, frente al parque"
                        />
                        <p className="text-xs text-muted-foreground">
                          Proporciona la dirección exacta donde está el problema
                        </p>
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
                        <FieldLabel htmlFor={field.name}>
                          Descripción del problema
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Describe detalladamente el problema que encontraste..."
                          rows={4}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Incluye todos los detalles posibles para ayudarnos a resolver el problema
                        </p>
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
                        <FieldLabel htmlFor={field.name}>Barrio</FieldLabel>
                        <Select
                          value={field.state.value === 0 ? "" : String(field.state.value)}
                          onValueChange={(v) => field.handleChange(Number(v))}
                        >
                          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                            <SelectValue placeholder="Selecciona tu barrio" />
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
                        <FieldLabel htmlFor={field.name}>
                          Tipo de reporte
                        </FieldLabel>
                        <Select
                          value={field.state.value === 0 ? "" : String(field.state.value)}
                          onValueChange={(v) => field.handleChange(Number(v))}
                        >
                          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                            <SelectValue placeholder="Seleccione tipo de reporte" />
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
              </FieldGroup>

              {UserProfile ? (
                <div className="rounded-lg border bg-muted/40 px-4 py-3">
                  <p className="text-sm font-medium text-foreground">
                    Tu reporte será enviado como: {UserProfile.Name} {UserProfile.Surname1}
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
                  <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row-reverse">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      form="create-report-user-form"
                      disabled={!canSubmit || isSubmitting || !UserProfile?.Id}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? "Enviando reporte..." : "Enviar reporte"}
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
