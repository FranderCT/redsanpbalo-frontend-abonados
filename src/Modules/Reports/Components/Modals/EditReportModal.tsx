import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
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

import { showApiErrorToast } from "@/core/api-error";
import {
  useAssignUserInCharge,
  useChangeReportState,
  useUpdateReport,
} from "../../Hooks/ReportsHooks";
import { useGetAllReportStates } from "../../Hooks/ReportStatesHooks";
import { useGetAllReportTypes } from "../../Hooks/ReportTypesHooks";
import { useGetAllReportLocations } from "../../Hooks/ReportLocationHooks";
import { useGetUsersByRoleFontanero } from "../../../Users/Hooks/UsersHooks";
import type { ReportListItem, ReportStateValue } from "../../Models/Report";
import { updateReportValidators } from "../../schemas/ReportSchema";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import ReportPhotoLightbox from "../ReportPhotoLightbox";

interface EditReportModalProps {
  report: ReportListItem;
  open: boolean;
  onClose: () => void;
}

export default function EditReportModal({
  report,
  open,
  onClose,
}: EditReportModalProps) {
  const updateReportMutation = useUpdateReport();
  const assignUserMutation = useAssignUserInCharge();
  const changeStateMutation = useChangeReportState();

  const { reportStates = [], isLoading: statesLoading } =
    useGetAllReportStates();
  const { reportTypes = [], isLoading: typesLoading } = useGetAllReportTypes();
  const { reportLocations = [], isLoading: locationsLoading } =
    useGetAllReportLocations();
  const { fontaneros = [], isPending: fontanerosLoading } =
    useGetUsersByRoleFontanero();

  const form = useForm({
    defaultValues: {
      ExactLocation: report.ExactLocation || "",
      Description: report.Description || "",
      ReportLocationId: report.ReportLocation?.Id || 0,
      ReportTypeId: report.ReportType?.Id || 0,
      ReportState: report.ReportState,
      PlumberUserId: report.AssignedPlumber?.Id || 0,
    },
    validators: {
      onChange: updateReportValidators,
      onSubmit: updateReportValidators,
    },
    onSubmit: async ({ value }) => {
      try {
        const selectedPlumberId = Number(value.PlumberUserId) || 0;
        const currentPlumberId = report.AssignedPlumber?.Id ?? 0;
        const selectedState = value.ReportState as ReportStateValue;
        const currentState = report.ReportState;
        const needsAssignment =
          selectedPlumberId > 0 && selectedPlumberId !== currentPlumberId;
        const requiresAssignedPlumber =
          selectedState === "En Proceso" || selectedState === "Resuelto";
        const hasAssignedPlumber =
          selectedPlumberId > 0 || currentPlumberId > 0;

        if (requiresAssignedPlumber && !hasAssignedPlumber) {
          toast.error(
            "Debes asignar un fontanero antes de cambiar el estado del reporte",
          );
          return;
        }

        await updateReportMutation.mutateAsync({
          reportId: report.Id.toString(),
          payload: {
            ExactLocation: value.ExactLocation,
            Description: value.Description,
            ReportLocationId: Number(value.ReportLocationId) || undefined,
            ReportTypeId: Number(value.ReportTypeId) || undefined,
          },
        });

        // El estado real del reporte puede cambiar automáticamente al asignar un fontanero
        // (el backend auto-transiciona de Pendiente → En Proceso al asignar).
        // Por eso usamos el estado retornado por la asignación como referencia.
        let stateAfterAssignment = currentState;

        if (needsAssignment) {
          const assignedReport = await assignUserMutation.mutateAsync({
            reportId: report.Id.toString(),
            plumberUserId: selectedPlumberId,
            instructions: "Asignado desde la edicion del reporte",
          });
          stateAfterAssignment = assignedReport.ReportState;
        }

        // Solo llamar al cambio de estado si el estado aún difiere del deseado
        // (evita el error "El reporte ya se encuentra en ese estado" cuando
        // la asignación del fontanero ya lo cambió automáticamente)
        if (selectedState !== stateAfterAssignment) {
          await changeStateMutation.mutateAsync({
            reportId: report.Id.toString(),
            newState: selectedState,
            reasonChange: `Cambio de estado realizado desde la edicion del reporte: ${stateAfterAssignment} -> ${selectedState}`,
          });
        }

        toast.success("Reporte actualizado exitosamente");
        form.reset();
        onClose();
      } catch (error) {
        showApiErrorToast(error);
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (open && report) {
      form.setFieldValue("ExactLocation", report.ExactLocation || "");
      form.setFieldValue("Description", report.Description || "");
      form.setFieldValue("ReportLocationId", report.ReportLocation?.Id || 0);
      form.setFieldValue("ReportTypeId", report.ReportType?.Id || 0);
      form.setFieldValue("ReportState", report.ReportState);
      form.setFieldValue("PlumberUserId", report.AssignedPlumber?.Id || 0);
    }
  }, [form, open, report]);

  const isLoading =
    statesLoading || typesLoading || locationsLoading || fontanerosLoading;

  const formatErrors = (errors: unknown[]) =>
    errors?.map((error) =>
      typeof error === "object" && error !== null && "message" in error
        ? { message: (error as { message: string }).message }
        : { message: String(error) },
    );

  const ReportField = form.Field;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
          onClose();
        }
      }}
    >
      <DialogContent className="flex max-h-[calc(100vh-2rem)] flex-col gap-0 overflow-hidden">
        <DialogHeader className="space-y-1.5 border-b px-6 py-5">
          <DialogTitle>Editar reporte #{report.Id}</DialogTitle>
          <DialogDescription>
            Modifica la informacion del reporte segun sea necesario.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center px-6 py-10">
            <p className="text-sm text-muted-foreground">
              Cargando informacion...
            </p>
          </div>
        ) : (
          <form
            id="edit-report-form"
            className="flex flex-1 min-h-0 flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto overflow-x-hidden px-6 py-4">
              {/* Preview foto existente */}
              {report.PhotoUrl && (
                <ReportPhotoLightbox src={report.PhotoUrl} thumbnailClass="h-40" />
              )}

              <FieldGroup className="gap-4">
                <ReportField
                  name="ExactLocation"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Ubicacion</FieldLabel>
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
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
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
                          Descripcion
                        </FieldLabel>
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
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="ReportLocationId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Barrio</FieldLabel>
                        <Select
                          value={
                            field.state.value === 0
                              ? ""
                              : String(field.state.value)
                          }
                          onValueChange={(value) =>
                            field.handleChange(Number(value))
                          }
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue placeholder="Seleccionar barrio" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportLocations.map((location) => (
                              <SelectItem
                                key={location.Id}
                                value={String(location.Id)}
                              >
                                {location.Neighborhood}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
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
                          value={
                            field.state.value === 0
                              ? ""
                              : String(field.state.value)
                          }
                          onValueChange={(value) =>
                            field.handleChange(Number(value))
                          }
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
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
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="ReportState"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(value as ReportStateValue)
                          }
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportStates.map((state) => (
                              <SelectItem
                                key={state.IdReportState}
                                value={state.Name}
                              >
                                {state.Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />

                <ReportField
                  name="PlumberUserId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-2">
                        <FieldLabel htmlFor={field.name}>
                          Fontanero encargado
                        </FieldLabel>
                        <Select
                          value={String(field.state.value)}
                          onValueChange={(value) =>
                            field.handleChange(Number(value))
                          }
                          disabled={fontanerosLoading}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue
                              placeholder={
                                fontanerosLoading
                                  ? "Cargando..."
                                  : "Sin asignar"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Sin asignar</SelectItem>
                            {fontaneros.map((fontanero) => (
                              <SelectItem
                                key={fontanero.Id}
                                value={String(fontanero.Id)}
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar>
                                    <AvatarImage src={fontanero.ProfilePhoto ?? ""} alt={fontanero.Name} />
                                    <AvatarFallback>{fontanero.Name.charAt(0)} {fontanero.Surname1.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{fontanero.Name} {fontanero.Surname1} {fontanero.Surname2}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError
                            errors={formatErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              <div className="rounded-lg border bg-muted/40 px-4 py-3">
                <p className="text-sm font-medium text-foreground">
                  Reportado por: {report.ReportedByDisplayName}
                </p>
                {report.ReportedBy?.Email ? (
                  <p className="text-xs text-muted-foreground">
                    {report.ReportedBy.Email}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  Fecha de creacion:{" "}
                  {new Date(report.CreatedAt).toLocaleString()}
                </p>
              </div>
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
                      form="edit-report-form"
                      disabled={!canSubmit || isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? "Actualizando..." : "Actualizar reporte"}
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
