export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('Rp', 'Rp ');
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000000 + Math.random() * 9000000);
  return `INV/${year}${month}${day}/XXI/V/${randomSuffix}`;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const randomSuffix = String(Math.floor(100 + Math.random() * 900));
  return `ORD-${yearMonth}-${randomSuffix}`;
}

export function getEstimatedDeliveryRange(daysAheadMin = 2, daysAheadMax = 4): string {
  const dateMin = new Date();
  dateMin.setDate(dateMin.getDate() + daysAheadMin);
  const dateMax = new Date();
  dateMax.setDate(dateMax.getDate() + daysAheadMax);

  const monthsIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const dayMin = dateMin.getDate();
  const dayMax = dateMax.getDate();
  const monthName = monthsIndo[dateMax.getMonth()];
  const year = dateMax.getFullYear();

  return `${dayMin} - ${dayMax} ${monthName} ${year}`;
}
