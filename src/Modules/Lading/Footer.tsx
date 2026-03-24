import { Facebook, Globe, Instagram, Twitter } from "lucide-react";
import LogoRedSanPablo from "../../assets/images/LogoRedSanPabloHB.svg";

export function Footer() {
  return (
    <footer className="bg-[#091540] text-white pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img src={LogoRedSanPablo} className="h-12 w-auto" alt="ASADA San Pablo" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md">
              Institución dedicada a la administración profesional del recurso hídrico,
              garantizando calidad y sostenibilidad para toda la comunidad de San Pablo,
              Nandayure.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/asadasanpablo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#005CAF] hover:border-[#005CAF] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#005CAF] hover:border-[#005CAF] transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#005CAF] hover:border-[#005CAF] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#005CAF] hover:border-[#005CAF] transition-all"
                aria-label="Web"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-[#005CAF]">
              Navegación
            </h4>
            <ul className="space-y-4 text-sm text-white/60">
              {[
                { href: "#inicio", label: "Inicio" },
                { href: "#sobre-nosotros", label: "Sobre Nosotros" },
                { href: "#servicios", label: "Servicios" },
                { href: "#mision-y-vision", label: "Misión y Visión" },
                { href: "#faq", label: "Preguntas Frecuentes" },
                { href: "#retroalimentacion", label: "Retroalimentación" },
                { href: "#contacto", label: "Contacto" },
              ].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-[#005CAF]">
              Contacto
            </h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li>San Pablo, Nandayure, Guanacaste</li>
              <li>Teléfono: 2101-7345</li>
              <li>WhatsApp: 8843-4072</li>
              <li>asadasanpablo.2014@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs tracking-wide">
            © {new Date().getFullYear()} ASADA San Pablo. Todos los derechos reservados.
            Desarrollado por @BinarySoftwareTeam
          </p>
          <div className="flex items-center gap-2 text-[#006D42] font-bold text-[10px] uppercase tracking-widest">
            <div className="w-2 h-2 bg-[#006D42]"></div>
            Sistema Operativo
          </div>
        </div>
      </div>
    </footer>
  );
}
