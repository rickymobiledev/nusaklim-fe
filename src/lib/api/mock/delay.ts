/** Simulasi latensi network untuk implementasi mock. */
export function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
