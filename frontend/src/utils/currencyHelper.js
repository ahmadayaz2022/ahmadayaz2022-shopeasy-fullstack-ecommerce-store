// Currency configuration
export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', flag: '🇵🇰' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
];

// Get currency info by code
export const getCurrencyInfo = (code) => {
  return currencies.find(c => c.code === code) || currencies[0];
};

// Format price with currency
export const formatPrice = (price, currency = 'USD') => {
  const currencyInfo = getCurrencyInfo(currency);
  
  if (!price || isNaN(price)) return `${currencyInfo.symbol}0.00`;
  
  // Format based on currency
  switch (currency) {
    case 'PKR':
    case 'INR':
      return ` ${currencyInfo.symbol} ${price.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    case 'EUR':
    case 'GBP':
      return `${currencyInfo.symbol}${price.toFixed(2)}`;
    default:
      return `${currencyInfo.symbol}${price.toFixed(2)}`;
  }
};

// Get currency symbol
export const getCurrencySymbol = (code) => {
  const currencyInfo = getCurrencyInfo(code);
  return currencyInfo.symbol;
};