import { Card, CardContent, CardDescription, CardIcon, CardTitle } from "../../../../Components/Cards";
import { useGetAllServices } from "../Hooks/ServicesHooks";
import { 
  Activity, 
  BadgeCheck, 
  BellRing, 
  MessageCircle, 
  Zap, 
  Droplets, 
  Wrench, 
  FileText, 
  Phone,
  HelpCircle
} from "lucide-react";

// Mapa de iconos
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "activity": Activity,
  "badge-check": BadgeCheck,
  "bell-ring": BellRing,
  "message-circle": MessageCircle,
  "zap": Zap,
  "droplets": Droplets,
  "wrench": Wrench,
  "file-text": FileText,
  "phone": Phone,
};

export function Services() {
    const { services, isPending, error } = useGetAllServices();

    const getIconComponent = (iconName?: string) => {
        if (!iconName) return Droplets; // Icono por defecto
        return ICON_MAP[iconName.toLowerCase()] || HelpCircle;
    };

    if (isPending) {
        return <div>Cargando servicios...</div>;
    }

    if (error) {
        return <div>Error al cargar los servicios</div>;
    }

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
            {services?.map((s, i) => {
                const IconComponent = getIconComponent(s.Icon);
                return (
                    <Card key={i} className="backdrop-blur">
                    <CardContent>
                        <CardIcon>
                            <IconComponent className="w-16 h-16" />
                        </CardIcon>
                        <CardTitle>{s.Title}</CardTitle>
                        <CardDescription>{s.Description}</CardDescription>
                    </CardContent>
                    </Card>
                );
            })}
            </div>
        </div>
        </section>
    );
}
