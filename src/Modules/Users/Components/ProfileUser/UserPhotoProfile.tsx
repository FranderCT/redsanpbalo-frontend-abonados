import type { UserProfile } from "../../Models/User"

type Props = {
  User? : UserProfile
}

const UserPhotoProfile = ({User} : Props) => {
  return (
    <article className="bg-[#F9F5FF] border border-gray-200 shadow-xl rounded-sm p-6 flex flex-col items-center text-center gap-5">
        <h3 className="font-semibold text-[#091540] mb-4">
            {User?.Name} {User?.Surname1} {User?.Surname2}
        </h3>
        <div className="size-40 lg:size-66 rounded-full overflow-hidden border-4 border-[#091540]/25">
          <img
            src="/Image02.png"
            className="w-full h-full object-cover border border-gray-200"
          />
        </div>
    </article>
  )
}

export default UserPhotoProfile