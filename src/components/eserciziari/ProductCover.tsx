import Image from "next/image";
import type { EserciziarioProduct } from "@/lib/eserciziari";

type Props = {
  product: EserciziarioProduct;
  className?: string;
  large?: boolean;
};

/** Cover immagine premium, con fallback tipografico se manca il file. */
export function ProductCover({ product, className = "", large = false }: Props) {
  if (product.coverImage) {
    return (
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-xl bg-navy ${className}`}
      >
        <Image
          src={product.coverImage}
          alt={`Copertina di ${product.title}`}
          fill
          sizes={large ? "(max-width: 768px) 90vw, 360px" : "(max-width: 768px) 90vw, 320px"}
          className="object-cover"
          priority={large}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-xl p-5 text-white sm:p-6 ${className}`}
      style={{
        background: `linear-gradient(165deg, ${product.coverAccent} 0%, #101B36 78%)`,
      }}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ background: "#C9A45C" }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] math-grid" />

      <div className="relative">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
          {product.subjectLabel}
        </span>
        <p
          className={`mt-4 font-display font-medium leading-tight tracking-tight ${
            large ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
          }`}
        >
          {product.title}
        </p>
      </div>

      <div className="relative flex items-end justify-between gap-3">
        <div className="text-xs text-white/70">
          <p>{product.exerciseCount} esercizi</p>
          <p className="mt-0.5">{product.format}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 font-display text-sm font-semibold text-gold">
          {product.coverLabel}
        </span>
      </div>
    </div>
  );
}
