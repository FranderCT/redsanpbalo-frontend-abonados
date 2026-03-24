import { MapPin, Clock, Phone } from "lucide-react";

export function Contact() {
  return (
    <section id="contacto" className="flex flex-col lg:flex-row min-h-[600px]">
      {/* Map */}
      <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-slate-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1124.7047465969597!2d-85.23129771762576!3d10.030591325105627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f9f99a09c433749%3A0x5cc371d9f957b2f3!2sAsada%20san%20pablo%20nandayure!5e1!3m2!1ses-419!2scr!4v1760098074295!5m2!1ses-419!2scr"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(1)", minHeight: "400px" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación ASADA San Pablo"
          className="hover:filter-none transition-all duration-700"
        />
      </div>

      {/* Contact info */}
      <div className="w-full lg:w-1/2 bg-[#091540] text-white p-12 md:p-24 flex flex-col justify-center">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">
          Visítenos en Oficina
        </h2>
        <div className="space-y-10">
          <div className="flex gap-6">
            <MapPin className="text-[#005CAF] w-8 h-8 shrink-0" />
            <div>
              <h4 className="font-bold text-lg mb-1">Ubicación</h4>
              <p className="text-white/70">
                100 metros oeste y 50 norte de la escuela de San Pablo,
                Nandayure, Guanacaste, Costa Rica.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <Clock className="text-[#005CAF] w-8 h-8 shrink-0" />
            <div>
              <h4 className="font-bold text-lg mb-1">Horario de Atención</h4>
              <p className="text-white/70">
                Lunes a Viernes: 8:00 AM – 5:00 PM
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <Phone className="text-[#005CAF] w-8 h-8 shrink-0" />
            <div>
              <h4 className="font-bold text-lg mb-1">Contacto Directo</h4>
              <p className="text-white/70">
                Oficina: 2101-7345
                <br />
                WhatsApp: 8843-4072
                <br />
                Correo: asadasanpablo.2014@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
