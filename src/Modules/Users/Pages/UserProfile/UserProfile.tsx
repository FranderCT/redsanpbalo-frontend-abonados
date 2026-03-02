import HeaderUserProfile from "../../Components/ProfileUser/HeaderUserProfile";
import UserPhotoProfile from "../../Components/ProfileUser/UserPhotoProfile";
import UserProfileDetails from "../../Components/ProfileUser/UserProfileDetails";
import { useGetUserProfile } from "../../Hooks/UsersHooks";
import { Separator } from "@/Components/ui/separator";

const Profile = () => {
  const { UserProfile } = useGetUserProfile();

  return (
    <main className="flex flex-col w-full min-h-full bg-background">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        <HeaderUserProfile />

        <Separator className="bg-border" />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UserPhotoProfile User={UserProfile} />
          <UserProfileDetails User={UserProfile} />
        </section>
      </div>
    </main>
  );
};

export default Profile;
