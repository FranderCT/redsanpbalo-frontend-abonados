"use client"

import { useForm } from "@tanstack/react-form"
import { MessageSquare, Send } from "lucide-react"
import { Card, CardContent } from "../../Components/Cards"
import { useCreateComment } from "../Comment/Hooks/commentHooks"
import { toast } from "react-toastify"

export function Feedback() {
    const commentMutation = useCreateComment();
    
    const form = useForm({
        defaultValues: { Message: "",},
        onSubmit: async ({ value }) => {
            try {
                await commentMutation.mutateAsync(value);
                toast.success("Comentario enviado!", { position: "top-right", autoClose: 3000 });
                form.reset();
            } catch (error: any) {
                console.log("error", error);
                toast.error("Fallo al enviar comentario!", { position: "top-right", autoClose: 3000 });
                form.reset();
            }
        },
    })

    return (
        <section id="retroalimentacion" className="py-24 px-6 bg-[#091540]">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
                <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-white">Retroalimentación Anónima</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto text-pretty">
                Comparta sus comentarios, sugerencias o inquietudes de forma completamente anónima. Su opinión nos ayuda a
                mejorar nuestros servicios.
            </p>
            </div>

            <Card className="shadow-lg !bg-[#f9f5ff] border-none">
            <CardContent className="p-8">
                <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="space-y-6"
                >
                <form.Field
                    name="Message"
                    validators={{
                    onChange: ({ value }) =>
                        !value || value.trim().length === 0 ? "El mensaje es requerido" : undefined,
                    }}
                >
                    {(field) => (
                    <div>
                        <label htmlFor="feedback-message" className="block text-base text-left font-medium mb-3 text-[#091540]">
                        Su Mensaje
                        </label>

                        {/* TEXTAREA NATIVO */}
                        <textarea
                        id="feedback-message"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Escriba aquí sus comentarios, sugerencias o inquietudes de forma anónima..."
                        disabled={form.state.isSubmitting}
                        className="
                            w-full min-h-[200px] resize-none
                            rounded-md border border-[#091540]/10 bg-white
                            px-4 py-3 text-[15px] text-[#091540] leading-6
                            shadow-sm
                            placeholder:text-slate-400
                            focus:outline-none focus:ring-2 focus:ring-[#1789FC] focus:border-transparent
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                        />

                        {field.state.meta.errors && (
                        <p className="text-sm text-red-600 mt-2">{field.state.meta.errors[0]}</p>
                        )}
                        <p className="text-sm text-left text-[#091540]/60 mt-2">
                        Este mensaje será enviado de forma anónima. No se recopilará ninguna información personal.
                        </p>
                    </div>
                    )}
                </form.Field>

                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                    /* BOTÓN NATIVO */
                    <button
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                        className="
                        w-full inline-flex items-center justify-center gap-2
                        rounded-md px-4 py-3 text-base font-medium
                        bg-[#1789fc]/90 text-white shadow-sm
                        hover:bg-[#091540]/90
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1789FC]
                        disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        {isSubmitting ? (
                        <>Enviando...</>
                        ) : (
                        <>
                            <Send className="h-5 w-5" />
                            Enviar Retroalimentación Anónima
                        </>
                        )}
                    </button>
                    )}
                </form.Subscribe>
                </form>

                <div className="mt-8 p-4 bg-[#091540]/5 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-[#091540]">
                    <MessageSquare className="h-5 w-5 text-[#091540]" />
                    ¿Por qué es anónimo?
                </h3>
                <p className="text-sm text-justify text-[#091540]/70 leading-relaxed">
                    Queremos que se sienta libre de expresar sus opiniones sin preocupaciones. La retroalimentación anónima
                    nos permite recibir comentarios honestos que nos ayudan a identificar áreas de mejora y servir mejor a
                    nuestra comunidad.
                </p>
                </div>
            </CardContent>
            </Card>
        </div>
        </section>
    )
}
