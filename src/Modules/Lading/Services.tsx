import { Droplets, Wrench, FileText, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardIcon, CardTitle } from "../../Components/Cards";

export function Services() {
    const services = [
        {
        icon: Droplets,
        title: "Suministro de Agua Potable",
        description: "Distribución continua de agua potable de alta calidad para toda la comunidad",
        },
        {
        icon: Wrench,
        title: "Mantenimiento",
        description: "Mantenimiento preventivo y correctivo de toda la infraestructura de acueductos",
        },
        {
        icon: FileText,
        title: "Gestión Administrativa",
        description: "Administración eficiente de recursos y servicios para la comunidad",
        },
        {
        icon: Phone,
        title: "Atención al Usuario",
        description: "Servicio de atención y respuesta rápida a consultas y emergencias",
        },
    ];

    return (
        <section id="servicios" className="py-24 px-6 bg-[#091540] text-white">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Nuestros Servicios</h2>
            <p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto">
                Ofrecemos servicios integrales para garantizar el acceso al agua potable y saneamiento
            </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
                <Card key={i} className="backdrop-blur">
                <CardContent>
                    <CardIcon>
                    <s.icon className="h-8 w-8 text-white" />
                    </CardIcon>
                    <CardTitle>{s.title}</CardTitle>
                    <CardDescription>{s.description}</CardDescription>
                </CardContent>
                </Card>
            ))}
            </div>
        </div>
        </section>
    );
}
