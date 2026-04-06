import { useState } from "react";
import { Link } from "@tanstack/react-router";
import LogoRedSanPablo from "../../assets/images/LogoRedSanPabloHG.svg";

export default function HeaderPaanee() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`html { scroll-behavior: smooth; } #root { padding-top: 0; }`}</style>

      <header className="fixed top-0 left-0 w-full z-[100] flex justify-between items-center px-6 md:px-12 py-4 bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(9,21,64,0.08)]">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3">
          <img src={LogoRedSanPablo} className="h-10 w-auto" alt="ASADA San Pablo" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#inicio" className="font-bold tracking-tight text-[#404754] hover:text-[#005CAF] transition-all">
            Inicio
          </a>
          <a href="#sobre-nosotros" className="font-bold tracking-tight text-[#404754] hover:text-[#005CAF] transition-all">
            Sobre Nosotros
          </a>
          <a href="#servicios" className="font-bold tracking-tight text-[#404754] hover:text-[#005CAF] transition-all">
            Servicios
          </a>
          <a href="#mision-y-vision" className="font-bold tracking-tight text-[#404754] hover:text-[#005CAF] transition-all">
            Misión y Visión
          </a>
          <a href="#faq" className="font-bold tracking-tight text-[#404754] hover:text-[#005CAF] transition-all">
            FAQ
          </a>
          <a href="#contacto" className="font-bold tracking-tight text-[#404754] hover:text-[#005CAF] transition-all">
            Contacto
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex bg-[#005CAF] text-white px-6 py-2.5 font-bold uppercase tracking-wider hover:bg-[#004689] transition-all text-sm"
          >
            Iniciar Sesión
          </Link>

          {/* Mobile toggle */}
          <button
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#091540" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed top-[72px] left-0 w-full bg-white border-t border-gray-200 z-[99] shadow-lg">
          <div className="px-6 py-6 space-y-1">
            {[
              { href: "#inicio", label: "Inicio" },
              { href: "#sobre-nosotros", label: "Sobre Nosotros" },
              { href: "#servicios", label: "Servicios" },
              { href: "#mision-y-vision", label: "Misión y Visión" },
              { href: "#faq", label: "FAQ" },
              { href: "#retroalimentacion", label: "Retroalimentación" },
              { href: "#contacto", label: "Contacto" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-bold text-[#091540] hover:text-[#005CAF] hover:bg-gray-50 transition-colors uppercase tracking-wider"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <Link
                to="/dashboard"
                className="block w-full px-4 py-3 text-sm font-bold text-white bg-[#005CAF] hover:bg-[#004689] transition-colors text-center uppercase tracking-wider"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
