"use client"

import { useForm } from "@tanstack/react-form";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateComment } from "../Comment/Hooks/commentHooks";

const FeedbackSchema = z.object({
  Message: z
    .string()
    .trim()
    .min(1, "El mensaje es requerido")
    .max(300, "Máx. 300 caracteres"),
});

const getErrorMessage = (errors: unknown[]) => {
  const error = errors[0];

  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return undefined;
};

export function Feedback() {
  const commentMutation = useCreateComment();

  const form = useForm({
    defaultValues: { Message: "" },
    validators: {
      onChange: FeedbackSchema,
      onSubmit: FeedbackSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await commentMutation.mutateAsync({ Message: value.Message.trim() });
        toast.success("Comentario enviado!", { position: "top-right", duration: 3000 });
        form.reset();
      } catch (error: any) {
        toast.error("Fallo al enviar comentario!", { position: "top-right", duration: 3000 });
        form.reset();
      }
    },
  });

  return (
    <section id="retroalimentacion" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-8 text-[#091540]">
              Escuchamos a la{" "}
              <span>Comunidad</span>.
            </h2>
            <p className="text-lg text-[#404754] mb-12">
              Sus sugerencias y comentarios nos ayudan a mejorar el servicio día
              con día. Utilice este formulario para enviarnos su retroalimentación
              de forma anónima.
            </p>
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 shadow-sm text-[#005CAF]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#091540]">Respuesta Garantizada</h4>
                <p className="text-sm text-[#404754]">
                  Respondemos a todas las consultas en menos de 24 horas hábiles.
                </p>
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="bg-white p-8 md:p-12 shadow-2xl border border-[#c0c6d6]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <form.Field
                name="Message"
              >
                {(field) => {
                  const errorMessage = getErrorMessage(field.state.meta.errors);

                  return (
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-[#404754]">
                        Mensaje
                      </label>
                      <textarea
                        id="feedback-message"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        maxLength={300}
                        placeholder="Escriba aquí sus comentarios, sugerencias o inquietudes de forma anónima..."
                        rows={6}
                        disabled={form.state.isSubmitting}
                        className="w-full bg-gray-50 border-b-2 border-transparent focus:border-[#005CAF] focus:ring-0 px-4 py-3 transition-all outline-none resize-none text-[#091540] placeholder:text-gray-400"
                      />
                      {errorMessage && (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                      )}
                      <div className="flex items-center justify-between gap-4 text-xs text-[#404754]">
                        <p>Este mensaje será enviado de forma anónima.</p>
                        <span aria-live="polite">{field.state.value.length}/300</span>
                      </div>
                    </div>
                  );
                }}
              </form.Field>

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full bg-[#091540] text-white py-4 font-black uppercase tracking-widest hover:bg-[#005CAF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    <span className="hidden md:inline">
                      {isSubmitting ? "Enviando..." : "Enviar Retroalimentación"}
                    </span>
                  </button>
                )}
              </form.Subscribe>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
