"use client";

import { useState } from "react";
import type { EserciziarioProduct } from "@/lib/eserciziari";
import { ESERCIZIARI_CHECKOUT_ENABLED } from "@/lib/eserciziari";
import { requestEserciziarioCheckout } from "@/lib/eserciziari/actions";

export function BuyButton({ product }: { product: EserciziarioProduct }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const canBuy = ESERCIZIARI_CHECKOUT_ENABLED;

  async function handleBuy() {
    if (!canBuy) {
      setMessage("Disponibile a breve: stiamo finalizzando i PDF e i pagamenti sicuri.");
      return;
    }
    setPending(true);
    setMessage(null);
    const res = await requestEserciziarioCheckout(product.slug);
    setPending(false);
    if (!res.ok) {
      setMessage(res.error);
      return;
    }
    window.location.href = res.checkoutUrl;
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleBuy}
        disabled={pending || !canBuy}
        className="btn-primary w-full !rounded-2xl !py-3.5 !text-[0.95rem] disabled:opacity-70"
      >
        {pending ? "Reindirizzamento a Stripe…" : "Acquista ora"}
      </button>
      {!canBuy && (
        <p className="mt-2.5 text-center text-sm leading-snug text-slate">
          <span className="font-semibold text-navy">Presto disponibile.</span>{" "}
          Acquisto e download in attivazione.
        </p>
      )}
      {canBuy && product.status === "draft" && (
        <p className="mt-2.5 text-center text-xs leading-snug text-slate">
          Pagamento in modalità test · download PDF in attivazione.
        </p>
      )}
      {message && (
        <p
          role="status"
          className="mt-3 rounded-xl bg-amber-50 px-3.5 py-2.5 text-center text-sm font-medium leading-snug text-amber-900"
        >
          {message}
        </p>
      )}
    </div>
  );
}
