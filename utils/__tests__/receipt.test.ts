import { generateReceiptEmail } from '../email';
import { Order } from '../../interfaces';

const order = (o: Partial<Order> = {}): Order => ({
  orderId: 'ABC-123',
  store: { id: 'store_1', name: 'Wildcats' },
  items: [],
  customer: { firstName: 'Sam', lastName: 'Rivera', email: 'sam@example.com', phone: '9205550134' },
  group: '',
  orderStatus: 'Unfulfilled',
  shippingMethod: 'Direct',
  shippingAddress: { street: '1 Main St', street2: '', city: 'New London', state: 'WI', zipcode: '54961' },
  summary: { subtotal: 1000, shipping: 0, salesTax: 55, total: 1055 },
  ...o,
} as Order);

it('escapes order values instead of rendering them as markup', () => {
  const { html } = generateReceiptEmail(order({
    store: { id: 'store_1', name: '<script>alert(1)</script>' },
    customer: { firstName: '<b>Sam', lastName: 'Rivera', email: 'a@b.com', phone: '9205550134' },
    shippingAddress: { street: '<img src=x onerror=alert(1)>', street2: '', city: 'X', state: 'WI', zipcode: '1' },
  }));
  expect(html).not.toContain('<script>alert');
  expect(html).not.toContain('<img src=x');
  expect(html).toContain('&lt;script&gt;');
});

it('encodes ids used in links', () => {
  const { html } = generateReceiptEmail(order({ orderId: 'A B&C' }));
  expect(html).toContain('orderId=A%20B%26C');
});
