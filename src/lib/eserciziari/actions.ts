"use server";

import { startEserciziarioCheckout } from "./checkout";

export async function requestEserciziarioCheckout(slug: string) {
  return startEserciziarioCheckout(slug);
}
