import UsersTable from "../Components/ListUsers/UsersTables";
import { useGetAllUsers } from "../Hooks/UsersHooks";

const ListUsers = () => {
  const { usersProfiles, isPending, error } = useGetAllUsers();

  if (isPending) return <p>Cargando...</p>;
  if (error) return <p>Ocurrió un error cargando usuarios</p>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-[#091540]">Lista de Usuarios</h2>
      <UsersTable data={usersProfiles ?? []} />
    </div>
  );
};

export default ListUsers;
