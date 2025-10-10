import { useState } from "react";
import LogoRedSanPablo from "../../assets/images/LogoRedSanPabloHG.svg";
import { Link } from "@tanstack/react-router";

// Paleta
// Blanco lavanda: #F9F5FF
// Verde: #68D89B
// Azul primario: #1789FC
// Azul oscuro: #091540
// Rojo acento: #F6132D

export default function HeaderPaanee() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        #root {
          padding-top: 0;
        }
      `}</style>
      {/* Main navbar */}
      <header className="w-full fixed top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-lg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#inicio" className="block">
                <img src={LogoRedSanPablo} className="h-12 w-auto" alt="Red San Pablo Logo" />
              </a>
            </div>

            {/* Desktop nav - centered */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-8">
                <a 
                  href="#inicio"
                  className="text-sm font-medium text-[#091540] hover:text-[#1789FC] transition-colors duration-200 py-2"
                >
                  Inicio
                </a>
                <a 
                  href="#sobre-nosotros"
                  className="text-sm font-medium text-[#091540] hover:text-[#1789FC] transition-colors duration-200 py-2"
                >
                  Sobre Nosotros
                </a>
                <a 
                  href="#servicios"
                  className="text-sm font-medium text-[#091540] hover:text-[#1789FC] transition-colors duration-200 py-2"
                >
                  Servicios
                </a>
                <a 
                  href="#proyectos"
                  className="text-sm font-medium text-[#091540] hover:text-[#1789FC] transition-colors duration-200 py-2"
                >
                  Proyectos
                </a>
                <a 
                  href="#noticias"
                  className="text-sm font-medium text-[#091540] hover:text-[#1789FC] transition-colors duration-200 py-2"
                >
                  Noticias
                </a>
                <a 
                  href="#contacto"
                  className="text-sm font-medium text-[#091540] hover:text-[#1789FC] transition-colors duration-200 py-2"
                >
                  Contacto
                </a>
              </div>
            </nav>

            {/* Actions - right aligned */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <Link 
                  to={"/dashboard"} 
                  className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-[#091540] hover:bg-[#1789FC] rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Dashboard
                </Link>
              </div>

              {/* Mobile toggle */}
              <button
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#F9F5FF] transition-colors duration-200"
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
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden bg-white border-t border-gray-200/50">
            <div className="px-4 py-6 space-y-1">
              <a 
                href="#inicio"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#091540] hover:text-[#1789FC] hover:bg-[#F9F5FF] rounded-lg transition-colors duration-200"
              >
                Inicio
              </a>
              <a 
                href="#sobre-nosotros"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#091540] hover:text-[#1789FC] hover:bg-[#F9F5FF] rounded-lg transition-colors duration-200"
              >
                Sobre Nosotros
              </a>
              <a 
                href="#servicios"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#091540] hover:text-[#1789FC] hover:bg-[#F9F5FF] rounded-lg transition-colors duration-200"
              >
                Servicios
              </a>
              <a 
                href="#proyectos"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#091540] hover:text-[#1789FC] hover:bg-[#F9F5FF] rounded-lg transition-colors duration-200"
              >
                Proyectos
              </a>
              <a 
                href="#noticias"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#091540] hover:text-[#1789FC] hover:bg-[#F9F5FF] rounded-lg transition-colors duration-200"
              >
                Noticias
              </a>
              <a 
                href="#contacto"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-[#091540] hover:text-[#1789FC] hover:bg-[#F9F5FF] rounded-lg transition-colors duration-200"
              >
                Contacto
              </a>
              <div className="pt-4 border-t border-gray-100">
                <Link 
                  to={"/dashboard"} 
                  className="block w-full px-4 py-3 text-sm font-semibold text-white bg-[#091540] hover:bg-[#1789FC] rounded-lg transition-colors duration-200 text-center"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
