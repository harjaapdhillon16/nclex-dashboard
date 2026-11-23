import { notFound } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { exams, medicalImages } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { MedicalFigure } from "@/components/medical-figure";
import { FIGURE_CATEGORIES } from "@/lib/medical-figures/registry";
import { ImageBrowser, type ImageCard } from "./browser";

export const metadata = { title: "Medical images" };

export default async function MedicalImagesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireUser();

  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) notFound();

  const rows = await db
    .select()
    .from(medicalImages)
    .where(and(eq(medicalImages.examId, exam.id), eq(medicalImages.status, "published")))
    .orderBy(asc(medicalImages.displayOrder), asc(medicalImages.id));

  const items: ImageCard[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    summary: r.summary ?? "",
    category: r.category,
    tags: r.tags,
    thumb: r.figureKey ? (
      <MedicalFigure figureKey={r.figureKey} compact />
    ) : r.imageUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={r.imageUrl} alt={r.altText ?? r.title} className="aspect-[3/2] w-full object-cover" loading="lazy" />
    ) : null,
  }));
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  const order = (n: string) => {
    const i = (FIGURE_CATEGORIES as readonly string[]).indexOf(n);
    return i < 0 ? 99 : i;
  };
  const categories = [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => order(a.name) - order(b.name) || a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Medical images</h1>
        <p className="max-w-2xl text-sm muted">
          Learn to recognise what you will see on exam day: ECG rhythms, EEG patterns, fetal heart rate tracings, wound and burn stages, and equipment. Each image comes with what to look for, common causes and the nursing priorities.
        </p>
      </header>
      {items.length === 0 ? (
        <div className="panel panel-pad text-sm muted">There are no medical images for {exam.shortName} yet.</div>
      ) : (
        <ImageBrowser examSlug={exam.slug} items={items} categories={categories} />
      )}
      <p className="text-[11px] faint">All figures are original illustrations created for QREXq for teaching purposes. They are schematic and are not patient records.</p>
    </div>
  );
}
