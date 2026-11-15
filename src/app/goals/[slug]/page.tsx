import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site/page-frame";
import { PathCourse } from "@/components/site/path-course";
import { diplomaBySlug, goalBySlug, goals, type Goal, type PathStep } from "@/content/paths";
import type { Course } from "@/content/site";
import { getCatalog } from "@/lib/catalog";

type GoalPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams(): { slug: string }[] {
  return goals.map((goal) => ({ slug: goal.slug }));
}

export async function generateMetadata({ params }: GoalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const goal = goalBySlug(slug);
  if (!goal) {
    return { title: "طريق الشغل" };
  }
  return {
    title: `طريق ${goal.title}`,
    description: goal.outcome,
    alternates: { canonical: `/goals/${goal.slug}` },
  };
}

function listed(catalog: Course[], steps: PathStep[]): { course: Course; note: string }[] {
  return steps.flatMap((step) => {
    const course = catalog.find((item) => item.slug === step.slug);
    return course ? [{ course, note: step.note }] : [];
  });
}

function GoalSteps({ goal, catalog }: { goal: Goal; catalog: Course[] }) {
  const steps = listed(catalog, goal.steps);
  if (steps.length !== goal.steps.length) {
    notFound();
  }
  const choice = goal.mode === "choices";
  return (
    <ol className="mt-10 space-y-4">
      {steps.map((step, index) => (
        <li key={step.course.slug}>
          <PathCourse course={step.course} note={step.note} index={choice ? undefined : index + 1} label={choice ? "اختيار" : undefined} />
        </li>
      ))}
    </ol>
  );
}

export default async function GoalPage({ params }: GoalPageProps) {
  const { slug } = await params;
  const goal = goalBySlug(slug);
  if (!goal) {
    notFound();
  }
  const catalog = await getCatalog();
  const extras = goal.extras ? listed(catalog, goal.extras) : [];
  const diploma = goal.diplomaSlug ? diplomaBySlug(goal.diplomaSlug) : undefined;

  return (
    <PageFrame wide>
      <p className="text-sm text-muted">
        <Link href="/goals" className="font-bold text-accent">
          طريق الشغل
        </Link>
      </p>
      <h1 className="font-display mt-3 text-4xl font-black sm:text-5xl">طريق {goal.title}</h1>
      <p className="mt-3 text-lg text-muted">{goal.line}</p>
      <p className="mt-4 max-w-2xl text-lg leading-8">{goal.outcome}</p>
      {goal.mode === "choices" ? (
        <p className="mt-4 text-base text-muted">اختار مجال واحد. مش لازم تاخد التلاتة.</p>
      ) : (
        <p className="mt-4 text-base text-muted">بالترتيب. كل كورس له سعره وصفحته، وتقدر تاخدهم باقة لو فيه دبلومة.</p>
      )}
      <GoalSteps goal={goal} catalog={catalog} />
      {extras.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-black">لو الاتجاه مختلف</h2>
          <ul className="mt-4 space-y-4">
            {extras.map((step) => (
              <li key={step.course.slug}>
                <PathCourse course={step.course} note={step.note} label="بديل" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {diploma ? (
        <p className="mt-8 text-base">
          <Link href={`/diplomas/${diploma.slug}`} className="font-bold text-accent">
            {diploma.title} بخصم على الكورسات دي
          </Link>
        </p>
      ) : null}
    </PageFrame>
  );
}
