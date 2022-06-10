import { render, screen } from '@testing-library/react';
import { Store, StoreProduct } from '../../interfaces';
import { formatToMoney } from '../../utils';
import StoreHome from '../../pages/store/[id]/index';

const fakeStore: Store = {
  _id: '1',
  storeId: 'str_1',
  name: 'Test Store Name',
  openDate: '2022-02-1T17:40:56.035Z',
  permanentlyOpen: false,
  closeDate: '2022-02-22T17:40:56.035Z',
  hasPrimaryShippingLocation: false,
  primaryShippingLocation: {
    name: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    zipcode: '',
  },
  allowDirectShipping: false,
  requireGroupSelection: false,
  groupTerm: '',
  groups: [],
  products: [],
  orders: [],
  createdAt: '',
  updatedAt: '',
};

const fakeProducts: StoreProduct[] = [
  {
    id: 'prod_1',
    inventoryProductId: 'inv_prod_1',
    merchandiseCode: 'merch_code_1',
    name: 'test product name',
    tag: 'product tag',
    productSkus: [],
    sizes: [{ id: '1', label: 'S', price: 100 }],
    colors: [
      {
        id: 'color_1',
        label: 'Black',
        hex: '#000000',
        primaryImage: '',
        secondaryImages: [],
      },
    ],
    personalization: {
      active: false,
      maxLines: 0,
      addons: [],
    },
    // includeCustomName: false,
    // includeCustomNumber: false,
  },
];

jest.mock('../../db', jest.fn());
jest.mock('next/router', () => require('next-router-mock'));

test('render store a close message when store has close date', () => {
  render(<StoreHome store={fakeStore} />);
  expect(screen.getByText(/this store will close on/i));
});

test("don't render close message when store is permanently open", () => {
  render(
    <StoreHome store={{ ...fakeStore, closeDate: '', permanentlyOpen: true }} />
  );
  expect(
    screen.queryByText(/this store will close on/i)
  ).not.toBeInTheDocument();
});

test('render message when store has no products', async () => {
  render(<StoreHome store={fakeStore} />);
  expect(
    screen.getByText(/this store currently has no products available./i)
  ).toBeInTheDocument();
});

test('render store products when store has products', async () => {
  render(<StoreHome store={{ ...fakeStore, products: fakeProducts }} />);
  screen.getByText(fakeStore.name);
  screen.getByText(fakeProducts[0].name);
  screen.getByText(fakeProducts[0].tag);
  screen.getByText(formatToMoney(fakeProducts[0].sizes[0].price));
  screen.getByText(fakeProducts[0].colors[0].label);
});

test('link store products to their store product page', async () => {
  render(<StoreHome store={{ ...fakeStore, products: fakeProducts }} />);

  expect(
    screen.getByRole('link', { name: /test product name/i })
  ).toHaveAttribute(
    'href',
    `/store/${fakeStore._id}/product?productId=${fakeProducts[0].id}&colorId=${fakeProducts[0].colors[0].id}`
  );
});
