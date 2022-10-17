export const defaultSize = {
  id: 'default',
  label: 'DEFAULT',
  price: 0,
};

export function getStoreStatus(openDate: string, closeDate: string | null) {
  const open = new Date(openDate);
  const close = new Date(closeDate || 'Jan 01 9999');
  const now = new Date();

  if (now < open || now > close) {
    return false;
  }

  if (now > open && now < close) {
    return true;
  }
}
