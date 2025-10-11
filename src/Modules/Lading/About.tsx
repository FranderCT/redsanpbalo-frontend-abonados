import { Users, Heart, Shield } from "lucide-react"

export function About() {
    return (
        <section id="sobre-nosotros" className="py-24 px-6 bg-[#F9F5FF]">
        <div className="max-w-7xl mx-auto">
            {/* Título */}
            <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#091540]">
                Quiénes Somos
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed text-[#091540]/80">
                Una organización comunitaria dedicada a garantizar el acceso al agua potable y
                servicios de saneamiento de calidad
            </p>
            </div>

            {/* Tres columnas */}
            <div className="grid md:grid-cols-3 gap-12">
            {/* Comunidad */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 bg-[#1789FC]/10">
                <Users className="h-12 w-12 text-[#1789FC]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#091540]">Comunidad</h3>
                <p className="leading-relaxed max-w-xs mx-auto text-[#091540]/80">
                Trabajamos de la mano con nuestra comunidad para garantizar
                servicios de calidad y accesibles para todos
                </p>
            </div>

            {/* Compromiso */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 bg-[#68D89B]/20">
                <Heart className="h-12 w-12 text-[#68D89B]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#091540]">Compromiso</h3>
                <p className="leading-relaxed max-w-xs mx-auto text-[#091540]/80">
                Nuestro compromiso es brindar agua de calidad y mantener la
                infraestructura en óptimas condiciones
                </p>
            </div>

            {/* Confianza */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 bg-[#091540]/10">
                <Shield className="h-12 w-12 text-[#091540]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#091540]">Confianza</h3>
                <p className="leading-relaxed max-w-xs mx-auto text-[#091540]/80">
                Operamos con transparencia y responsabilidad para mantener la
                confianza de nuestra comunidad
                </p>
            </div>
            </div>
        </div>
        </section>
    )
}
