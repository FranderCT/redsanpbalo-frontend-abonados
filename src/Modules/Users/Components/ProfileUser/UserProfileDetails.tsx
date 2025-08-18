const UserProfileDetails = () => {
  return (
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
  )
}

export default UserProfileDetails