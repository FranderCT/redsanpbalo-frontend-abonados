import AuditFeedSection from "../Components/AuditFeedSection";

export default function UserAuditPage() {
  return (
    <section className="mx-auto flex min-w-0 max-w-5xl flex-col space-y-4 p-4 sm:p-6 md:space-y-6">
      <AuditFeedSection
        scope="all"
        title="Auditorias"
        description="Historial reciente de cambios en usuarios y solicitudes."
        loadingLabel="Cargando auditorias..."
      />
    </section>
  );
}
