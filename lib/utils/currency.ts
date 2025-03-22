/**
 * Formats a number as FCFA currency
 * @param amount - The amount to format
 * @returns Formatted string with FCFA currency symbol
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
};
