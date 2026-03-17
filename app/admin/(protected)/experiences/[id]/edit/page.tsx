import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ExperienceForm } from '@/components/admin/experience-form';

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await db.experience.findUnique({ where: { id }, include: { translations: true } });
  if (!experience) notFound();
  return <ExperienceForm experience={{ ...experience, basePrice: Number(experience.basePrice) }} />;
}
