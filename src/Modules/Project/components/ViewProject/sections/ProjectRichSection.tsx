import type { Project } from "../../../Models/Project";

type Props = { data: Project };

function SectionBlock({ title, html }: { title: string; html?: string | null }) {
  if (!html) return null;
  return (
    <div className="rounded-lg border bg-card p-5 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div
        className="prose prose-sm max-w-none text-foreground
          prose-headings:font-semibold prose-headings:text-foreground
          prose-p:text-muted-foreground prose-li:text-muted-foreground
          prose-strong:text-foreground prose-strong:font-semibold
          [&_*]:break-words [&_*]:[overflow-wrap:anywhere]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default function ProjectRichSection({ data }: Props) {
  return (
    <>
      <SectionBlock title="Objetivo" html={data.Objective} />
      <SectionBlock title="Descripción" html={data.Description} />
      <SectionBlock title="Observaciones" html={data.Observation} />
    </>
  );
}
