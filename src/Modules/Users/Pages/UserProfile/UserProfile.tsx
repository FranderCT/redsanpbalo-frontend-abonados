import HeaderUserProfile from "../../Components/ProfileUser/HeaderUserProfile"
import UserPhotoProfile from "../../Components/ProfileUser/UserPhotoProfile"
import UserProfileDetails from "../../Components/ProfileUser/UserProfileDetails"


const Profile = () => {
  return (
    <main className="flex flex-col justify-center min-h-full w-full bg-[#F9F5FF]">
      {/* Header */}
      <HeaderUserProfile/>
      <div className="border-b border-dashed border-gray-300 mb-8 mt-6"></div>
      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Foto de perfil */}
        <UserPhotoProfile/>
        {/* Información del usuario */}
        <UserProfileDetails/> 
      </section>
    </main>
  )
}

export default Profile