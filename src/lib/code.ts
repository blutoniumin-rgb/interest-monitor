import { randomInt } from "node:crypto";

/** No O/0 or I/1 so codes are easy to read aloud. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_LENGTH = 6;

export function generateNestCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return code;
}
