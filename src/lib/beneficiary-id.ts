// ABHA-aligned 12-digit ID generator.
// In production this would call the ABHA enrollment API.
// For the demo, we generate locally with a Luhn-like checksum.
export function generateBeneficiaryId12(): string {
  const random11 = Array.from({ length: 11 }, () =>
    Math.floor(Math.random() * 10),
  ).join("");
  const checksum = luhnChecksum(random11);
  return random11 + checksum.toString();
}

function luhnChecksum(digits: string): number {
  let sum = 0;
  let alt = true;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i]!, 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return (10 - (sum % 10)) % 10;
}

export function formatBeneficiaryId(id: string): string {
  // 12 digits → "1234 5678 9012"
  return id.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
}
