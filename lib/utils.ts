// Utility functions for Cavite App

/**
 * Basic class merge utility mimicking cn
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}
