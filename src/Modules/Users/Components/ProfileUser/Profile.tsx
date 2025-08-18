

const Profile = () => {
  return (
    <main className="flex flex-col content-center w-full h-dvh max-w-6xl mx-auto px-4 md:px-25 pt-24 pb-20 bg-[#F9F5FF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#091540]">Perfil</h1>
          <p className="text-[#091540]/70 text-md">
            Observe todos los detalles de su perfil aquí
          </p>
        </div>
        <button 
          type="button"
          className="flex items-center gap-2 text-[#F6132D] text-xl px-3 py-1 rounded-sm border-solid border-3 border-[#F6132D] hover:bg-red-200 mt-3 md:mt-0"
        >
          {/* ícono lápiz */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 17.25V21h3.75L18.81 8.94l-3.75-3.75L3 17.25z" stroke="#F6132D" />
            <path d="M14.06 5.19l3.75 3.75" stroke="#F6132D" />
          </svg>
          Editar
        </button>
      </div>
      <div className="border-b border-dashed border-gray-300 mb-8 mt-6"></div>
      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Foto de perfil */}
        <article className="bg-[#F9F5FF] border border-gray-200 gap-4 shadow-xl rounded-sm p-6 flex flex-col items-center text-center gap-5">
          <h3 className="font-semibold text-[#091540] mb-4">
            Frander Carrillo Torres
          </h3>
          <img
            src="/Image02.png"
            className="w-40 h-40 rounded-full object-cover border border-gray-200"
          />
        </article>

        {/* Información del usuario */}
        <article className="md:col-span-2 bg-[#F9F5FF] border border-gray-200 gap-4 shadow-xl rounded-sm p-6">
          <h3 className="text-center font-semibold text-[#091540] mb-4">
            Su información
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
            {/* Fila: Correo / Fecha nacimiento */}
            <div className="py-2 border-b border-dashed border-gray-300">
              <p className="text-[12px] text-gray-500">Correo</p>
              <span className="text-sm font-medium break-all text-[#091540]">
                frandercarrillo23@gmail.com
              </span>
            </div>
            <div className="py-2 border-b border-dashed border-gray-300">
              <p className="text-[12px] text-gray-500">Fecha de Nacimiento</p>
              <span className="text-sm font-medium text-[#091540]">17-07-2002</span>
            </div>

            {/* Fila: Teléfono / Cédula */}
            <div className="py-2 border-b border-dashed border-gray-300">
              <p className="text-[12px] text-gray-500">Teléfono</p>
              <span className="text-sm font-medium text-[#091540]">+506 86060559</span>
            </div>
            <div className="py-2 border-b border-dashed border-gray-300">
              <p className="text-[12px] text-gray-500">Cédula</p>
              <span className="text-sm font-medium text-[#091540]">504440503</span>
            </div>

            {/* Fila: NIS / Rol */}
            <div className="py-2 border-b border-dashed border-gray-300">
              <p className="text-[12px] text-gray-500">NIS</p>
              <span className="text-sm font-medium text-[#091540]">656</span>
            </div>
            <div className="py-2 border-b border-dashed border-gray-300">
              <p className="text-[12px] text-gray-500">Rol</p>
              <span className="text-sm font-medium text-[#091540]">Invitado</span>
            </div>

            {/* Fila: Dirección (a lo ancho) */}
            <div className="sm:col-span-2 py-2">
              <p className="text-[12px] text-gray-500">Dirección</p>
              <span className="text-sm font-medium text-[#091540]">
                200 metros al este de carnicería La Unión
              </span>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}

export default Profile