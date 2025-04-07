/**
 * Formats a number as INR currency string
 * @param amount Amount to format (in INR)
 * @returns Formatted string with ₹ symbol
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Calculates the tax amount based on a percentage
 * @param amount Base amount
 * @param taxPercentage Tax percentage (e.g., 18 for 18%)
 * @returns Tax amount
 */
export function calculateTax(amount: number, taxPercentage: number = 18): number {
  return Math.round(amount * (taxPercentage / 100));
}

/**
 * Calculates the total amount including tax
 * @param amount Base amount
 * @param taxPercentage Tax percentage (e.g., 18 for 18%)
 * @returns Total amount including tax
 */
export function calculateTotalWithTax(amount: number, taxPercentage: number = 18): number {
  return amount + calculateTax(amount, taxPercentage);
}

/**
 * Calculates the total amount for multiple nights stay
 * @param pricePerNight Price per night
 * @param nights Number of nights
 * @returns Total amount for the stay
 */
export function calculateTotalForStay(pricePerNight: number, nights: number): number {
  return pricePerNight * nights;
}
