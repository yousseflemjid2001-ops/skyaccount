export const formatCurrency = (amount, currency = 'EGP') => {
    if (amount === null || amount === undefined || amount === '') return '';
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
    if (isNaN(num)) return amount; // Fallback if parsing fails
    return `${currency} ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
