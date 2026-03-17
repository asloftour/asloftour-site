CREATE TYPE "Locale" AS ENUM ('TR', 'EN', 'AR');
CREATE TYPE "RoleKey" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SALES', 'VIEWER');
CREATE TYPE "ExperienceCategory" AS ENUM ('YACHT', 'ACCOMMODATION', 'BALLOON', 'VILLA', 'VIP_TRANSFER', 'GASTRONOMY', 'CUSTOM');
CREATE TYPE "PricingMode" AS ENUM ('PER_BOOKING', 'PER_PERSON', 'PER_NIGHT', 'PER_WEEK', 'PER_TRANSFER', 'CUSTOM');
CREATE TYPE "ReservationStatus" AS ENUM ('NEW', 'PENDING_CONFIRMATION', 'PENDING_PAYMENT', 'PENDING_TRANSFER', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'SPAM');
CREATE TYPE "InquiryType" AS ENUM ('GENERAL', 'PRIVATE_PLANNING', 'APPOINTMENT');
CREATE TYPE "PaymentMethod" AS ENUM ('CARD_3D', 'BANK_TRANSFER', 'PAYMENT_LINK');
CREATE TYPE "PaymentProvider" AS ENUM ('NONE', 'MOCK', 'GENERIC_VPOS', 'AKBANK', 'HALKBANK', 'GARANTI_BBVA', 'ISBANK');
CREATE TYPE "PaymentStatus" AS ENUM ('NEW', 'PENDING', 'PENDING_TRANSFER', 'PENDING_REVIEW', 'AUTHORIZED', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "TransferProofStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "LegalDocumentType" AS ENUM ('POLICIES', 'PRIVACY', 'COOKIES', 'DISTANCE_SALES', 'CANCELLATION_REFUND', 'PRE_INFORMATION', 'SERVICE_AGREEMENT');

CREATE TABLE "Role" (
  "id" TEXT PRIMARY KEY,
  "key" "RoleKey" NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "roleId" TEXT NOT NULL REFERENCES "Role"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Experience" (
  "id" TEXT PRIMARY KEY,
  "category" "ExperienceCategory" NOT NULL,
  "location" TEXT NOT NULL,
  "pricingMode" "PricingMode" NOT NULL,
  "basePrice" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'TRY',
  "minGuests" INTEGER NOT NULL DEFAULT 1,
  "maxGuests" INTEGER NOT NULL DEFAULT 2,
  "minNights" INTEGER,
  "minWeeks" INTEGER,
  "highlights" JSONB NOT NULL,
  "galleryImages" JSONB NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "paymentEligibility" BOOLEAN NOT NULL DEFAULT true,
  "availabilityNotes" JSONB,
  "bookingRules" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ExperienceTranslation" (
  "id" TEXT PRIMARY KEY,
  "experienceId" TEXT NOT NULL REFERENCES "Experience"("id") ON DELETE CASCADE,
  "locale" "Locale" NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "longDescription" TEXT NOT NULL,
  "seoTitle" TEXT NOT NULL,
  "seoDescription" TEXT NOT NULL,
  UNIQUE ("locale", "slug"),
  UNIQUE ("experienceId", "locale")
);

CREATE TABLE "Reservation" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "locale" "Locale" NOT NULL,
  "status" "ReservationStatus" NOT NULL DEFAULT 'NEW',
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "guestCount" INTEGER NOT NULL,
  "addTransfer" BOOLEAN NOT NULL DEFAULT false,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "specialRequests" TEXT,
  "billingType" TEXT,
  "billingFullName" TEXT,
  "billingCompany" TEXT,
  "billingTaxOffice" TEXT,
  "billingTaxNumber" TEXT,
  "billingAddress" TEXT,
  "totalAmount" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'TRY',
  "internalNotes" TEXT,
  "sourceIp" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ReservationItem" (
  "id" TEXT PRIMARY KEY,
  "reservationId" TEXT NOT NULL REFERENCES "Reservation"("id") ON DELETE CASCADE,
  "experienceId" TEXT NOT NULL REFERENCES "Experience"("id"),
  "titleSnapshot" TEXT NOT NULL,
  "pricingMode" "PricingMode" NOT NULL,
  "unitPrice" DECIMAL(12,2) NOT NULL,
  "quantity" INTEGER NOT NULL,
  "totalPrice" DECIMAL(12,2) NOT NULL,
  "details" JSONB
);

CREATE TABLE "Inquiry" (
  "id" TEXT PRIMARY KEY,
  "type" "InquiryType" NOT NULL,
  "locale" "Locale" NOT NULL,
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "experienceId" TEXT,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "company" TEXT,
  "message" TEXT NOT NULL,
  "preferredDate" TIMESTAMP(3),
  "internalNotes" TEXT,
  "sourceIp" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ContactSubmission" (
  "id" TEXT PRIMARY KEY,
  "locale" "Locale" NOT NULL,
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "message" TEXT NOT NULL,
  "sourceIp" TEXT,
  "internalNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Payment" (
  "id" TEXT PRIMARY KEY,
  "reservationId" TEXT NOT NULL REFERENCES "Reservation"("id") ON DELETE CASCADE,
  "method" "PaymentMethod" NOT NULL,
  "provider" "PaymentProvider" NOT NULL DEFAULT 'NONE',
  "status" "PaymentStatus" NOT NULL DEFAULT 'NEW',
  "amount" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'TRY',
  "installment" INTEGER NOT NULL DEFAULT 1,
  "cardBrand" TEXT,
  "transactionReference" TEXT,
  "providerResponse" JSONB,
  "paymentLinkToken" TEXT UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PaymentAttempt" (
  "id" TEXT PRIMARY KEY,
  "paymentId" TEXT NOT NULL REFERENCES "Payment"("id") ON DELETE CASCADE,
  "provider" "PaymentProvider" NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "sessionToken" TEXT NOT NULL UNIQUE,
  "requestPayload" JSONB,
  "responsePayload" JSONB,
  "callbackVerified" BOOLEAN NOT NULL DEFAULT false,
  "transactionReference" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TransferProof" (
  "id" TEXT PRIMARY KEY,
  "paymentId" TEXT NOT NULL REFERENCES "Payment"("id") ON DELETE CASCADE,
  "fileName" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "note" TEXT,
  "status" "TransferProofStatus" NOT NULL DEFAULT 'PENDING',
  "reviewedAt" TIMESTAMP(3),
  "reviewedById" TEXT REFERENCES "User"("id"),
  "reviewNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "LegalDocument" (
  "id" TEXT PRIMARY KEY,
  "type" "LegalDocumentType" NOT NULL,
  "locale" "Locale" NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("type", "locale"),
  UNIQUE ("locale", "slug")
);

CREATE TABLE "SiteSetting" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "value" JSONB NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PaymentProviderSetting" (
  "id" TEXT PRIMARY KEY,
  "provider" "PaymentProvider" NOT NULL UNIQUE,
  "merchantId" TEXT,
  "terminalId" TEXT,
  "storeKeyEncrypted" TEXT,
  "apiUrl" TEXT,
  "successUrl" TEXT,
  "failUrl" TEXT,
  "callbackUrl" TEXT,
  "testMode" BOOLEAN NOT NULL DEFAULT true,
  "active" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "actorUserId" TEXT REFERENCES "User"("id"),
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "before" JSONB,
  "after" JSONB,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MediaAsset" (
  "id" TEXT PRIMARY KEY,
  "uploaderId" TEXT REFERENCES "User"("id"),
  "fileName" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "altText" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "RateLimitHit" (
  "id" TEXT PRIMARY KEY,
  "scope" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 1,
  "lastHitAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("scope", "key")
);
