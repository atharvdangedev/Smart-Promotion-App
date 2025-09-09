export default function formatCurrency(price) {
  return Number(price).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
}
