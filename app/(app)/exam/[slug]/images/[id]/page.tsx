import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { exams, medicalImages } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { MarkdownText } from "@/components/markdown-text";
import { MedicalFigure } from "@/components/medical-figure";
import { PrintButton } from "@/components/print-button";

export default async function MedicalImagePage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  await requireUser();
  const imageId = Number(id);
  if (!Number.isFinite(imageId)) notFound();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const all = await db
    .select({ id: medicalImages.id, title: medicalImages.title, category: medicalImages.category, figureKey: medicalImages.figureKey })
    .from(medicalImages)
    .where(and(eq(medicalImages.examId, exam.id), eq(medicalImages.status, "published")))
    .orderBy(asc(medicalImages.displayOrder), asc(medicalImages.id));
  const idx = all.findIndex((r) => r.id === imageId);
  if (idx < 0) notFound();
  const [img] = await db.select().from(medicalImages).where(eq(medicalImages.id, imageId)).limit(1);

  const prev = all[idx - 1];
  const next = all[idx + 1];
  const related = all.filter((r) => r.category === img.category && r.id !== img.id && r.figureKey).slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href={`/exam/${exam.slug}/images`} className="no-print inline-flex items-center gap-1.5 text-xs font-medium muted hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        All medical images
      </Link>

      <header className="space-y-2">
        <span className="chip bg-accent-subtle text-xs font-semibold text-accent">{img.category}</span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{img.title}</h1>
        {img.summary && <p className="text-sm muted">{img.summary}</p>}
      </header>

      <figure className="panel overflow-hidden">
        <div className="bg-white">
          {img.figureKey ? (
            <MedicalFigure figureKey={img.figureKey} />
          ) : img.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img.imageUrl} alt={img.altText ?? img.title} className="mx-auto max-h-[28rem] w-auto" />
          ) : null}
        </div>
        <figcaption className="border-t border-border px-4 py-3 text-xs muted">
          {img.altText}
          {img.credit && <span className="mt-1 block faint">{img.credit}</span>}
        </figcaption>
      </figure>

      <article className="panel panel-pad">
        <MarkdownText text={img.body} />
        {img.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-3">
            {img.tags.map((t) => (
              <span key={t} className="chip text-[11px]">
                {t}
              </span>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="no-print space-y-3">
          <h2 className="text-base font-bold">More in {img.category}</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/exam/${exam.slug}/images/${r.id}`} className="panel block overflow-hidden transition hover:border-accent/60">
                  <div className="border-b border-border bg-white">{r.figureKey && <MedicalFigure figureKey={r.figureKey} compact />}</div>
                  <div className="p-3 text-sm font-semibold leading-snug">{r.title}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <PrintButton label="Print / save as PDF" />
        <div className="flex items-center gap-2">
          {prev && (
            <Link href={`/exam/${exam.slug}/images/${prev.id}`} className="btn btn-secondary btn-sm" title={prev.title}>
              <ArrowLeft className="h-3.5 w-3.5" /> Previous
            </Link>
          )}
          {next && (
            <Link href={`/exam/${exam.slug}/images/${next.id}`} className="btn btn-secondary btn-sm" title={next.title}>
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
