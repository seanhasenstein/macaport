import { generateReceiptEmail, generateCodeEmailHtml } from '../email';
import { Order } from '../../interfaces';

const order = (o: Partial<Order> = {}): Order =>
  ({
    orderId: 'ABC-123',
    store: { id: 'store_1', name: 'Wildcats' },
    items: [],
    customer: {
      firstName: 'Sam',
      lastName: 'Rivera',
      email: 'sam@example.com',
      phone: '9205550134',
    },
    group: '',
    orderStatus: 'Unfulfilled',
    shippingMethod: 'Direct',
    shippingAddress: {
      street: '1 Main St',
      street2: '',
      city: 'New London',
      state: 'WI',
      zipcode: '54961',
    },
    summary: { subtotal: 1000, shipping: 0, salesTax: 55, total: 1055 },
    ...o,
  } as Order);

it('escapes order values instead of rendering them as markup', () => {
  const { html } = generateReceiptEmail(
    order({
      store: { id: 'store_1', name: '<script>alert(1)</script>' },
      customer: {
        firstName: '<b>Sam',
        lastName: 'Rivera',
        email: 'a@b.com',
        phone: '9205550134',
      },
      shippingAddress: {
        street: '<img src=x onerror=alert(1)>',
        street2: '',
        city: 'X',
        state: 'WI',
        zipcode: '1',
      },
    })
  );
  expect(html).not.toContain('<script>alert');
  expect(html).not.toContain('<img src=x');
  expect(html).toContain('&lt;script&gt;');
});

it('encodes ids used in links', () => {
  const { html } = generateReceiptEmail(order({ orderId: 'A B&C' }));
  expect(html).toContain('orderId=A%20B%26C');
});

it('lists every adjustment between the subtotal and the tax, text and html', () => {
  const { text, html } = generateReceiptEmail(
    order({
      summary: {
        subtotal: 8000,
        adjustments: [
          { kind: 'credit', label: 'Employee Store Credit', amount: -7500 },
        ],
        shipping: 0,
        salesTax: 440,
        total: 940,
        stripeFee: 57,
      },
    })
  );

  expect(text).toContain('Subtotal: $80.00');
  expect(text).toContain('Employee Store Credit: -$75.00');
  expect(text).toContain('Sales Tax: $4.40');
  expect(text).toContain('Total: $9.40');
  expect(html).toContain('Employee Store Credit');
  expect(html).toContain('-$75.00');
  // 80.00 + 4.40 + 0 - 75.00 = 9.40: the lines shown add to the total shown.
  expect(8000 + 440 + 0 - 7500).toBe(940);
});

it("still shows a legacy order's discount through the fallback", () => {
  const { text } = generateReceiptEmail(
    order({
      summary: {
        subtotal: 6000,
        discount: 2500,
        shipping: 1000,
        salesTax: 193,
        total: 4693,
        stripeFee: 166,
      },
      switchFitnessDiscount: { id: 'x', email: 'a@b.com' },
    })
  );

  expect(text).toContain('Switch Fitness Promo: -$25.00');
});

describe('the sign-in code email', () => {
  const html = generateCodeEmailHtml({
    code: '482913',
    storeName: 'Acme <Employees>',
    benefitName: 'Employee Store Credit',
    expiresAt: Date.now() + 10 * 60 * 1000,
    resent: false,
  });

  it('carries the code, the store, the benefit and the expiry', () => {
    expect(html).toContain('482913');
    expect(html).toContain('Acme &lt;Employees&gt;');
    expect(html).toContain('Employee Store Credit');
    expect(html).toMatch(/expires in (9|10) minutes/);
    expect(html).toContain('Never share this code');
  });

  it('is in the shared shell, logo and address included', () => {
    expect(html).toContain('email-logo.png');
    expect(html).toContain('New London, WI 54961');
    expect(html).toContain('Privacy policy');
  });

  it('explains a repeat send', () => {
    const again = generateCodeEmailHtml({
      code: '482913',
      storeName: 'Acme',
      benefitName: 'Credit',
      expiresAt: Date.now() + 60000,
      resent: true,
    });
    expect(again).toContain('same code');
  });
});
