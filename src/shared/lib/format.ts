const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const formatPrice = (value: number) => priceFormatter.format(value);
export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));
