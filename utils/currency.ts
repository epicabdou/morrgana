// utils/currency.ts - UPDATED with MAD currency
export function formatPrice(amount: number, currency: string = 'MAD'): string {
  if (currency === 'MAD') {
    // Custom formatting for MAD since it might not be in all Intl implementations
    return `${amount.toFixed(2)} MAD`
  }
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatPriceSimple(amount: number): string {
  return `${amount.toFixed(2)} MAD`
}