export type BannerSlot = "hero" | "cta";

export interface BannerItem {
  id: number;
  slot: BannerSlot;
  image: string;
  eyebrow?: string | null;
  title?: string | null;
  titleHighlight?: string | null;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
  active: boolean;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
