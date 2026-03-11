import type { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Button } from "@/Components/ui/button";
import { CircleHelp, Wrench } from "lucide-react";

const EditLanding = ({ children }: PropsWithChildren) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const viewMode = pathname.includes("/edit-landing/services") ? "services" : "faq";

    return (
        <section className="flex flex-col p-3 sm:p-6 space-y-4 md:space-y-6 min-w-0 overflow-x-hidden">
            <header className="space-y-3 shrink-0 min-w-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-lg sm:text-2xl font-bold text-[#091540] truncate">
                            Página Informativa
                        </h1>
                        <p className="text-xs sm:text-base text-[#091540]/70">
                            Administre el contenido visible en la landing desde vistas separadas.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-stretch gap-2 min-w-0">
                        <Button
                            variant={viewMode === "faq" ? "default" : "outline"}
                            size="sm"
                            className="h-9 text-xs sm:text-sm justify-center"
                            onClick={() => navigate({ to: "/dashboard/edit-landing/faq" })}
                        >
                            <CircleHelp className="size-3.5 sm:size-4 shrink-0 mr-1" />
                            FAQ
                        </Button>
                        <Button
                            variant={viewMode === "services" ? "default" : "outline"}
                            size="sm"
                            className="h-9 text-xs sm:text-sm justify-center"
                            onClick={() => navigate({ to: "/dashboard/edit-landing/services" })}
                        >
                            <Wrench className="size-3.5 sm:size-4 shrink-0 mr-1" />
                            Servicios
                        </Button>
                    </div>
                </div>
                <div className="border-b border-dashed border-gray-300 pt-2" />
            </header>

            <div>{children}</div>
        </section>
    )
}

export default EditLanding
