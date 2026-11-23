/**
 * Chiavi oggetti nel bucket R2 privato `claudio-tutoring-eserciziari`.
 * slug prodotto → nome file esatto su R2.
 */
export const ESERCIZIARI_R2_KEYS: Record<string, string> = {
  "continuita-derivabilita-differenziabilita":
    "Dispensa_Analisi2_20_Esercizi_Soluzioni_Dettagliate.pdf",
  "sistemi-lineari-rouche-capelli":
    "ClaudioTutoring_20_Sistemi_Lineari_Gauss_Completo.pdf",
  "numeri-complessi-e-integrali": "ClaudioTutoring_Complessi_e_Integrali.pdf",
  "studi-di-funzione":
    "ClaudioTutoring_15_Studi_di_Funzione_Stile_Originale_1.pdf",
};

export function getR2KeyForSlug(slug: string) {
  return ESERCIZIARI_R2_KEYS[slug] ?? null;
}
