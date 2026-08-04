import { pbkdf2, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);
const iterations = 310_000;
const keyLength = 32;
const digest = "sha256";

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await pbkdf2Async(password, salt, iterations, keyLength, digest);
  return `pbkdf2$${iterations}$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, storedIterations, salt, hash] = storedHash.split("$");
  const parsedIterations = Number(storedIterations);

  if (
    algorithm !== "pbkdf2" ||
    !salt ||
    !hash ||
    !Number.isSafeInteger(parsedIterations) ||
    parsedIterations < 1
  ) {
    return false;
  }

  const derivedHash = await pbkdf2Async(
    password,
    salt,
    parsedIterations,
    keyLength,
    digest,
  );
  const storedBuffer = Buffer.from(hash, "hex");

  return (
    storedBuffer.length === derivedHash.length &&
    timingSafeEqual(storedBuffer, derivedHash)
  );
}
