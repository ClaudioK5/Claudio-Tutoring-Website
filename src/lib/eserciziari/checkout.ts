import "server-only";
import { getProductBySlug } from "@/lib/eserciziari";
import { getR2KeyForSlug } from "./pdf-keys";
import { createR2DownloadUrl, isR2Configured } from "./r2";
import {
  getSiteOrigin,
  getStripe,
  isStripeConfigured,
  isStripeTestMode,
} from "./stripe";

/**
 * Checkout eserciziari via Stripe Checkout (hosted).
 * Dopo pagamento: URL firmato R2 per il PDF dello slug acquistato.
 */

export type CheckoutStartResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; error: string };

export function isEserciziariCheckoutEnabled() {
  if (process.env.ESERCIZIARI_CHECKOUT_ENABLED === "false") return false;
  if (process.env.ESERCIZIARI_CHECKOUT_ENABLED === "true") return true;
  return isStripeConfigured();
}

/** In test Stripe permettiamo l'acquisto anche su prodotti draft. */
export function canPurchaseProduct(status: "draft" | "live") {
  if (!isEserciziariCheckoutEnabled()) return false;
  if (status === "live") return true;
  return isStripeTestMode();
}

export async function startEserciziarioCheckout(slug: string): Promise<CheckoutStartResult> {
  if (!isEserciziariCheckoutEnabled() || !isStripeConfigured()) {
    return {
      ok: false,
      error: "L'acquisto non è ancora disponibile. Gli eserciziari sono in anteprima.",
    };
  }

  const product = getProductBySlug(slug);
  if (!product || !canPurchaseProduct(product.status)) {
    return { ok: false, error: "Prodotto non disponibile all'acquisto." };
  }

  const priceId = process.env.STRIPE_PRICE_ESERCIZIARIO?.trim();
  if (!priceId) {
    return { ok: false, error: "Prezzo Stripe non configurato." };
  }

  const origin = getSiteOrigin();

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/eserciziari/acquisto/successo?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/eserciziari/${product.slug}?checkout=annullato`,
      metadata: {
        slug: product.slug,
        productTitle: product.title,
        subjectLabel: product.subjectLabel,
        pdfKey: product.privatePdfKey ?? getR2KeyForSlug(product.slug) ?? "",
      },
      payment_intent_data: {
        metadata: {
          slug: product.slug,
          productTitle: product.title,
        },
        description: `Eserciziario: ${product.title}`,
      },
      custom_text: {
        submit: {
          message: `Stai acquistando: ${product.title} (PDF). Dopo il pagamento potrai scaricare il file.`,
        },
      },
    });

    if (!session.url) {
      return { ok: false, error: "Impossibile avviare Stripe Checkout." };
    }

    return { ok: true, checkoutUrl: session.url };
  } catch (err) {
    console.error("[eserciziari/checkout]", err);
    return {
      ok: false,
      error: "Errore durante la creazione del pagamento. Riprova tra poco.",
    };
  }
}

/** Genera link download firmato per lo slug acquistato (R2 privato). */
export async function createTimedDownloadUrlForSlug(slug: string): Promise<string | null> {
  if (!isR2Configured()) return null;
  const key = getR2KeyForSlug(slug) ?? getProductBySlug(slug)?.privatePdfKey;
  if (!key) return null;
  try {
    return await createR2DownloadUrl(key, key.split("/").pop());
  } catch (err) {
    console.error("[eserciziari/r2-download]", err);
    return null;
  }
}
