/**
 * Chiavi oggetti nel bucket R2 privato `claudio-tutoring-eserciziari`.
 * slug prodotto → nome file esatto su R2.
 */
export const ESERCIZIARI_R2_KEYS: Record<string, string> = {
  "sistemi-lineari-rouche-capelli":
    "ClaudioTutoring_Sistemi_Lineari_Rouche_Capelli_20_Esercizi_v2.pdf",
  "numeri-complessi-e-integrali": "ClaudioTutoring_Complessi_e_Integrali.pdf",
  "studi-di-funzione": "ClaudioTutoring_15_Studi_di_Funzione_Premium_v3.pdf",
};

export function getR2KeyForSlug(slug: string) {
  return ESERCIZIARI_R2_KEYS[slug] ?? null;
}
