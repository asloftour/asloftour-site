import { LegalDocumentType, Locale } from '@prisma/client';
import { cache } from 'react';
import { db } from '@/lib/db';
import { toLocaleEnum } from '@/lib/utils';
import { AppLocale } from '@/i18n/routing';
import { getExperienceCopy, getExperienceImage } from '@/lib/experience-media';

export const getExperiences = cache(async (locale: AppLocale, featured?: boolean) => {
  const items = await db.experience.findMany({
    where: { active: true, ...(featured ? { featured: true } : {}) },
    include: {
      translations: { where: { locale: toLocaleEnum(locale) as Locale } }
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }]
  });

  return items.map((item) => {
    const translation = item.translations[0];
    const slug = translation?.slug;
    const image = getExperienceImage(slug);
    return {
      ...item,
      galleryImages: [image],
      translation: translation
        ? {
            ...translation,
            shortDescription: getExperienceCopy(slug, locale, translation.shortDescription || '')
          }
        : translation
    };
  });
});

export const getExperienceBySlug = cache(async (locale: AppLocale, slug: string) => {
  const translation = await db.experienceTranslation.findUnique({
    where: { locale_slug: { locale: toLocaleEnum(locale) as Locale, slug } },
    include: { experience: true }
  });

  if (!translation) return null;

  const image = getExperienceImage(translation.slug);

  return {
    ...translation.experience,
    galleryImages: [image],
    translation: {
      ...translation,
      shortDescription: getExperienceCopy(translation.slug, locale, translation.shortDescription || '')
    }
  };
});

export const getExperienceOptions = cache(async (locale: AppLocale) => {
  const items = await getExperiences(locale);
  return items.map((item) => ({
    value: item.id,
    label: item.translation?.title || item.location,
    minGuests: item.minGuests,
    maxGuests: item.maxGuests,
    pricingMode: item.pricingMode,
    basePrice: Number(item.basePrice),
    image: Array.isArray(item.galleryImages) ? (item.galleryImages[0] as string) : '/images/default-card.svg',
    shortDescription: item.translation?.shortDescription || '',
    location: item.location,
    category: item.category
  }));
});

export const getLegalDocument = cache(async (locale: AppLocale, type: LegalDocumentType) => {
  return db.legalDocument.findUnique({
    where: { type_locale: { type, locale: toLocaleEnum(locale) as Locale } }
  });
});

export const getSiteSettings = cache(async () => {
  const settings = await db.siteSetting.findMany();
  return settings.reduce<Record<string, any>>((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
});
