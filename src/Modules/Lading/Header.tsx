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
    <div className="min-h-screen bg-[#F9F5FF] text-[#091540]">
      {/* Top info bar */}
      <div className="w-full bg-gradient-to-b from-[#F9F5FF] to-white/60 text-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-4 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0"><path d="M12 22s8-4.5 8-12a8 8 0 1 0-16 0c0 7.5 8 12 8 12Z" stroke="#1789FC" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="#1789FC" strokeWidth="2"/></svg>
              <span className="hidden sm:block">San Pablo, Nandayure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0"><path d="M4 6h16v12H4z" stroke="#1789FC" strokeWidth="2"/><path d="m4 7 8 6 8-6" stroke="#1789FC" strokeWidth="2"/></svg>
              <span className="hidden sm:block">info@website.com</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[#091540]">
            {/* Socials */}
            {[
              <path key="fb" d="M14 8h-2V7a1 1 0 0 1 1-1h1V3h-2a3 3 0 0 0-3 3v2H7v3h2v7h3v-7h2l1-3Z"/>,
              <path key="x" d="M4 4l16 16M20 4 4 20"/>,
              <path key="g" d="M21 12a9 9 0 1 1-2.64-6.36M12 12h9"/>,
              <circle key="ig" cx="12" cy="12" r="6"/>,
            ].map((d, i) => (
              <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">{d}</svg>
            ))}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center py-3 gap-4">
            {/* Logo */}
            <a href="#">
              <img src={LogoRedSanPablo} className="h-16 w-auto" />
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {['Home','About Us','Services','News','Pages','Contact'].map((item) => (
                <a key={item} href="#" className="text-[15px] font-medium hover:text-[#1789FC] transition-colors">
                  {item}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <Link to={"/dashboard"} className="ml-1 px-5 py-2.5 text-white font-semibold bg-[#1789FC] hover:bg-[#091540] transition shadow-sm">
                Dashboard
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-[#F9F5FF]"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#091540" strokeWidth="2">
                {open ? (
                  <path d="M6 6l12 12M18 6 6 18" />
                ) : (
                  <>
                    <path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden border-t border-[#091540]/10">
            <div className="px-4 py-4 space-y-2">
              {['Home','About Us','Services','News','Pages','Contact'].map((item) => (
                <a key={item} href="#" className="block rounded-lg px-3 py-2 font-medium hover:bg-[#F9F5FF]">
                  {item}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <Link to={"/login"} className="ml-1 px-5 py-2.5 text-white font-semibold bg-[#1789FC] hover:bg-[#091540] transition shadow-sm">
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Demo page padding */}
      {/* <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6">
          <div className="rounded-2xl p-6 shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">Demo contenido</h2>
            <p className="text-[#091540]/80">Este es un ejemplo de cabecera inspirado en tu referencia, usando la paleta (#F9F5FF, #68D89B, #1789FC, #091540, #F6132D). Ajusta textos, enlaces y acciones según tu proyecto.</p>
          </div>
          <div className="rounded-2xl p-6 bg-[#68D89B]/10 border border-[#68D89B]/30">
            <p className="text-sm">Tip: Puedes reemplazar el botón azul por uno verde <span className="inline-block rounded px-2 py-0.5 bg-[#68D89B] text-white ml-1">#68D89B</span> si deseas enfatizar éxito/confirmación, o usar el rojo <span className="inline-block rounded px-2 py-0.5 bg-[#F6132D] text-white ml-1">#F6132D</span> para alertas.</p>
          </div>
        </div>
      </main> */}
    </div>
  );
}
