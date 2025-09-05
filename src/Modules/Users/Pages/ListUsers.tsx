import UsersTable from "../Components/ProfileUser/ListUsers/UsersTables";
import { useGetAllUsers } from "../Hooks/UsersHooks";

const ListUsers = () => {
  const { usersProfiles, isPending, error } = useGetAllUsers();

  if (isPending) return <p>Cargando...</p>;
  if (error) return <p>Ocurrió un error cargando usuarios</p>;

  return (
    <div className="h-full w-full flex items-center justify-center">
      <UsersTable data={usersProfiles ?? []} />
    </div>
  );
};

export default ListUsers;
