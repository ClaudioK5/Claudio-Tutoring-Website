import { PRICING_PACKAGES, type PackageId } from "@/lib/constants";

export const ADMIN_PACKAGE_LABELS: Record<PackageId, string> = {
  "pack-10": "10-hour package",
  "pack-5": "5-hour package",
  single: "1-hour individual lesson",
};

export const ADMIN_PACKAGE_ORDER: PackageId[] = ["pack-10", "pack-5", "single"];

export const SOURCES = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "meta-ads", label: "Meta Ads" },
  { id: "referral", label: "Referral" },
  { id: "other", label: "Other" },
] as const;

export type SourceId = (typeof SOURCES)[number]["id"];

export type Student = {
  id: string;
  name: string;
  subject: string;
  packageId: PackageId;
  totalLessons: number;
  /** Package value in euros, frozen when the package was assigned. */
  packageValue: number;
  lessonsCompleted: number;
  source: SourceId | null;
  createdAt: string;
};

export type StudentInput = {
  name: string;
  subject: string;
  packageId: PackageId;
  source: SourceId | null;
};

export function getPackage(id: PackageId) {
  const pkg = PRICING_PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new Error(`Unknown package: ${id}`);
  return pkg;
}

export function isPackageId(value: unknown): value is PackageId {
  return PRICING_PACKAGES.some((p) => p.id === value);
}

export function isSourceId(value: unknown): value is SourceId {
  return SOURCES.some((s) => s.id === value);
}

export function sourceLabel(id: SourceId | null) {
  return SOURCES.find((s) => s.id === id)?.label ?? null;
}

export function earnedValue(student: Student) {
  if (student.totalLessons <= 0) return 0;
  return (student.lessonsCompleted * student.packageValue) / student.totalLessons;
}

export function clampLessons(value: number, total: number) {
  return Math.min(Math.max(value, 0), total);
}

export function formatEuro(value: number) {
  return `€${value.toLocaleString("it-IT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
