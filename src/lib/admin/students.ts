import { PRICING_PACKAGES, type PackageId } from "@/lib/constants";

export const ITEM_ORDER: PackageId[] = ["single", "pack-5", "pack-10"];

export const ITEM_LABELS: Record<PackageId, { one: string; many: string }> = {
  single: { one: "individual lesson", many: "individual lessons" },
  "pack-5": { one: "5-hour package", many: "5-hour packages" },
  "pack-10": { one: "10-hour package", many: "10-hour packages" },
};

export const MAX_ITEM_COUNT = 99;

export const SOURCES = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "meta-ads", label: "Meta Ads" },
  { id: "referral", label: "Referral" },
  { id: "other", label: "Other" },
] as const;

export type SourceId = (typeof SOURCES)[number]["id"];

/** How many of each lesson type / package the student has bought. */
export type ItemCounts = Record<PackageId, number>;

export type Student = {
  id: string;
  name: string;
  subject: string;
  items: ItemCounts;
  totalLessons: number;
  /** Total value in euros of everything bought. */
  packageValue: number;
  lessonsCompleted: number;
  source: SourceId | null;
  createdAt: string;
};

export type StudentInput = {
  name: string;
  subject: string;
  items: ItemCounts;
  source: SourceId | null;
};

export function emptyItems(): ItemCounts {
  return { single: 0, "pack-5": 0, "pack-10": 0 };
}

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

export function itemLabel(id: PackageId, count: number) {
  return count === 1 ? ITEM_LABELS[id].one : ITEM_LABELS[id].many;
}

export function summarizeItems(items: ItemCounts) {
  let lessons = 0;
  let value = 0;
  for (const id of ITEM_ORDER) {
    const pkg = getPackage(id);
    lessons += items[id] * pkg.hours;
    value += items[id] * pkg.value;
  }
  return { lessons, value };
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
