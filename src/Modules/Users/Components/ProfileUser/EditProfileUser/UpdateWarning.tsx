import OpenModalButton from "../Modals/OpenModalButton";


    const  UpdateWarning = () => {
        
    return (
                <div className="w-full max-w-md bg-white rounded-sm shadow-lg border-t-20 border-[#091540] px-8 py-10">
                <div className="flex flex-col items-center gap-4 text-center">
                
                <div className="text-[#091540] text-sm md:text-base">¿Está seguro de que quiere confirmar los cambios realizados en su perfil?</div>

                <div className="mt-4 flex w-full justify-center gap-4">
                    <button
                    type="button"
                    className="bg-[#F6132D] hover:bg-red-700 text-white font-semibold w-1/3 px-6 py-2 rounded"
                    onClick={() => navigator({ to: "/login" })}
                    className="bg-[#68D89B] hover:bg-green-600 text-white font-semibold w-1/3 py-2 rounded disabled:opacity-60">Aceptar</button>

                    <button
                    type="button"
                    className="bg-[#F6132D] hover:bg-red-700 text-white font-semibold w-1/3 px-6 py-2 rounded"
                    onClick={() => navigator({ to: "/login" })}
                    >Cancelar</button>
                </div>
            </div>
            </div>
        )
};

export default UpdateWarning;
