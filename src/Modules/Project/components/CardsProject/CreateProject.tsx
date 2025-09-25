import { useNavigate } from "@tanstack/react-router";

const CreateProjectModal = () => {
  const navigate = useNavigate();

  const goNewProject = () => {
    // si usas ESLint no-floating-promises, puedes hacer: void navigate({ to: "/projects/new-project" });
    navigate({ to: '/dashboard/projects/new-project' });
  };

  return (
    <div>
      <button
        type="button"
        onClick={goNewProject}
        className="inline-flex px-5 py-2 bg-[#091540] text-white shadow hover:bg-[#1789FC] transition-colors"
      >
        + Añadir Proyecto
      </button>
    </div>
  );
};

export default CreateProjectModal;
