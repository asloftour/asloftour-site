import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

function buildTranslation(formData: FormData, locale: "TR" | "EN" | "AR") {
  return {
    locale,
    title: String(formData.get(`title_${locale}`) || ""),
    slug: String(formData.get(`slug_${locale}`) || ""),
    shortDescription: String(formData.get(`short_${locale}`) || ""),
    longDescription: String(formData.get(`long_${locale}`) || ""),
    seoTitle: String(formData.get(`seoTitle_${locale}`) || ""),
    seoDescription: String(formData.get(`seoDescription_${locale}`) || "")
  };
}

async function save(formData: FormData, mode: "create" | "update") {
  const translations = ["TR", "EN", "AR"].map((locale) => buildTranslation(formData, locale as any));
  const payload = {
    category: String(formData.get("category")) as any,
    location: String(formData.get("location")),
    pricingMode: String(formData.get("pricingMode")) as any,
    basePrice: Number(formData.get("basePrice")),
    currency: String(formData.get("currency")),
    minGuests: Number(formData.get("minGuests")),
    maxGuests: Number(formData.get("maxGuests")),
    minNights: formData.get("minNights") ? Number(formData.get("minNights")) : null,
    minWeeks: formData.get("minWeeks") ? Number(formData.get("minWeeks")) : null,
    galleryImages: String(formData.get("galleryImages") || "").split("\n").filter(Boolean),
    highlights: String(formData.get("highlights") || "").split("\n").filter(Boolean),
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
    paymentEligibility: formData.get("paymentEligibility") === "on"
  };

  if (mode === "create") {
    return db.experience.create({
      data: {
        ...payload,
        translations: { create: translations }
      }
    });
  }

  const id = String(formData.get("id"));
  await db.experience.update({ where: { id }, data: payload });
  for (const translation of translations) {
    await db.experienceTranslation.upsert({
      where: { experienceId_locale: { experienceId: id, locale: translation.locale as any } },
      update: translation,
      create: { ...translation, experienceId: id }
    });
  }
  return { id };
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const formData = await request.formData();
  const experience = await save(formData, "create");
  return NextResponse.json(experience);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const formData = await request.formData();
  const experience = await save(formData, "update");
  return NextResponse.json(experience);
}
