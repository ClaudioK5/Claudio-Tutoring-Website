// Usage: npm run hash-pin -- <your-pin>
// Prints the two environment variables needed by the /admin dashboard.
import { randomBytes, scryptSync } from "node:crypto";

const pin = process.argv[2];
if (!pin) {
  console.error("Usage: npm run hash-pin -- <your-pin>");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(pin, salt, 32);

console.log(`ADMIN_PIN_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}`);
