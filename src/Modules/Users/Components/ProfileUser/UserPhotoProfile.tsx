
const UserPhotoProfile = () => {
  return (
    <article className="bg-[#F9F5FF] border border-gray-200 gap-4 shadow-xl rounded-sm p-6 flex flex-col items-center text-center gap-5">
        <h3 className="font-semibold text-[#091540] mb-4">
            Frander Carrillo Torres
        </h3>
        <img
            src="/Image02.png"
            className="w-40 h-40 rounded-full object-cover border border-gray-200"
        />
    </article>
  )
}

export default UserPhotoProfile