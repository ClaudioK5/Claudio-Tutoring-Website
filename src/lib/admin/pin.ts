import "server-only";
import { scrypt, timingSafeEqual } from "node:crypto";

function scryptAsync(password: string, salt: Buffer, keyLength: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, (err, derived) => (err ? reject(err) : resolve(derived)));
  });
}

/** Expects ADMIN_PIN_HASH in the form `scrypt:<saltHex>:<hashHex>` (see scripts/hash-pin.mjs). */
export async function verifyPin(pin: string) {
  const stored = process.env.ADMIN_PIN_HASH;
  if (!stored) return false;

  const [algorithm, saltHex, hashHex] = stored.split(":");
  if (algorithm !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(pin, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
