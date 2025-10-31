import { Facebook, Mail } from "lucide-react"
import LogoRedSanPablo from "../../assets/images/LogoRedSanPabloHB.svg"

export function Footer() {
    return (
        <footer className="text-white py-16 px-6 bg-gradient-to-b from-[#091540] to-[#091540]">
            <div className="max-w-7xl mx-auto">
                {/* Grid */}
                <div className="grid md:grid-cols-4 gap-10 mb-10">
                {/* Brand */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <img src={LogoRedSanPablo} className="h-12 w-auto" alt="Red San Pablo Logo" />
                        </div>
                    </div>
                    <p className="leading-relaxed text-white/80 text-sm max-w-xs">
                        Comprometidos con el suministro de agua potable de calidad para la comunidad de San Pablo, Nandayure.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Enlaces Rápidos</h3>
                    <ul className="space-y-2 text-sm">
                    <li>
                        <a href="#inicio" className="text-white/80 hover:text-white transition-colors">
                        Inicio
                        </a>
                    </li>
                    <li>
                        <a href="#sobre-nosotros" className="text-white/80 hover:text-white transition-colors">
                        Sobre nosotros
                        </a>
                    </li>
                    <li>
                        <a href="#servicios" className="text-white/80 hover:text-white transition-colors">
                        Servicios
                        </a>
                    </li>
                    <li>
                        <a href="#mision-y-vision" className="text-white/80 hover:text-white transition-colors">
                        Misión y Visión
                        </a>
                    </li>
                    <li>
                        <a href="#faq" className="text-white/80 hover:text-white transition-colors">
                        Preguntas frecuentes
                        </a>
                    </li>
                    <li>
                        <a href="#retroalimentacion" className="text-white/80 hover:text-white transition-colors">
                        Retroalimentación
                        </a>
                    </li>
                    <li>
                        <a href="#contacto" className="text-white/80 hover:text-white transition-colors">
                        Contacto
                        </a>
                    </li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Servicios</h3>
                    <ul className="space-y-2 text-sm">
                    <li className="text-white/80">Suministro de Agua</li>
                    <li className="text-white/80">Mantenimiento</li>
                    <li className="text-white/80">Atención al Cliente</li>
                    <li className="text-white/80">Emergencias 24/7</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Contacto</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="text-white/80"> San Pablo, Nandayure</li>
                        <li className="text-white/80"> Teléfono: 2101-7345</li>
                        <li className="text-white/80"> WhatsApp: 8843-4072</li>
                        <li className="text-white/80"> Correo: asadasanpablo.2014@gmail.com</li>
                    </ul>

                    <div className="flex gap-4 mt-5">
                        <a
                            href="https://www.facebook.com/asadasanpablo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            aria-label="Facebook ASADA Red San Pablo"
                        >
                            <Facebook className="h-5 w-5" />
                        </a>
                        
                        <a
                            href="mailto:info@asadasanpablo.cr"
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            aria-label="Correo electrónico"
                        >
                            <Mail className="h-5 w-5" />
                        </a>
                    </div>
                </div>
                </div>

                {/* Divider + copyright */}
                <div className="border-t border-white/20 pt-8 text-center text-sm text-white/80">
                <p>© {new Date().getFullYear()} RedSanPablo. Todos los derechos reservados. Desarrrollado por @BinarySoftwareTeam</p>
                </div>
            </div>
        </footer>
    )
}
