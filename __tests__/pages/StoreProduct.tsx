import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from 'test-utils';
import { Store, StoreProduct } from '../../interfaces';
import Product from '../../pages/store/[id]/product';

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

const fakeProduct: StoreProduct = {
  id: 'store_prod_1',
  inventoryProductId: 'inv_prod_1',
  merchandiseCode: 'merch_code_1',
  name: 'test product name',
  tag: 'product tag',
  includeCustomName: true,
  includeCustomNumber: true,
  productSkus: [
    {
      id: 'prod_sku_1',
      storeProductId: 'str_prod_1',
      inventoryProductId: 'inv_prod_1',
      inventorySkuId: 'inv_sku_1',
      color: {
        id: 'color_1',
        label: 'Black',
        hex: '#000000',
        primaryImage: '',
        secondaryImages: [],
      },
      size: { id: '1', label: 'Small', price: 100 },
      inventory: 0,
      active: true,
    },
    {
      id: 'prod_sku_2',
      storeProductId: 'str_prod_1',
      inventoryProductId: 'inv_prod_1',
      inventorySkuId: 'inv_sku_2',
      color: {
        id: 'color_1',
        label: 'Black',
        hex: '#000000',
        primaryImage: '',
        secondaryImages: [],
      },
      size: { id: '2', label: 'Medium', price: 200 },
      inventory: 0,
      active: true,
    },
    {
      id: 'prod_sku_3',
      storeProductId: 'str_prod_1',
      inventoryProductId: 'inv_prod_1',
      inventorySkuId: 'inv_sku_3',
      color: {
        id: 'color_1',
        label: 'Black',
        hex: '#000000',
        primaryImage: '',
        secondaryImages: [],
      },
      size: { id: '3', label: 'Large', price: 300 },
      inventory: 0,
      active: true,
    },
    {
      id: 'prod_sku_4',
      storeProductId: 'str_prod_1',
      inventoryProductId: 'inv_prod_1',
      inventorySkuId: 'inv_sku_4',
      color: {
        id: 'color_2',
        label: 'Gray',
        hex: '#cccccc',
        primaryImage: '',
        secondaryImages: [],
      },
      size: { id: '1', label: 'Small', price: 100 },
      inventory: 0,
      active: true,
    },
    {
      id: 'prod_sku_5',
      storeProductId: 'str_prod_1',
      inventoryProductId: 'inv_prod_1',
      inventorySkuId: 'inv_sku_5',
      color: {
        id: 'color_2',
        label: 'Gray',
        hex: '#cccccc',
        primaryImage: '',
        secondaryImages: [],
      },
      size: { id: '2', label: 'Medium', price: 200 },
      inventory: 1,
      active: true,
    },
    {
      id: 'prod_sku_6',
      storeProductId: 'str_prod_1',
      inventoryProductId: 'inv_prod_1',
      inventorySkuId: 'inv_sku_6',
      color: {
        id: 'color_2',
        label: 'Gray',
        hex: '#cccccc',
        primaryImage: '',
        secondaryImages: [],
      },
      size: { id: '3', label: 'Large', price: 300 },
      inventory: 3,
      active: true,
    },
  ],
  sizes: [
    { id: '1', label: 'Small', price: 100 },
    { id: '2', label: 'Medium', price: 200 },
    { id: '3', label: 'Large', price: 300 },
  ],
  colors: [
    {
      id: 'color_1',
      label: 'Black',
      hex: '#000000',
      primaryImage: '',
      secondaryImages: [],
    },
    {
      id: 'color_2',
      label: 'Gray',
      hex: '#cccccc',
      primaryImage: '',
      secondaryImages: [],
    },
  ],
};

jest.mock('../../db', jest.fn());
jest.mock('next/router', () => require('next-router-mock'));

test('render color out of stock message when color is unavailable', () => {
  render(<Product store={fakeStore} product={fakeProduct} />);
  userEvent.click(screen.getByLabelText(/small/i));
  screen.getByText(/this color is currently sold out./i);
});

test("don't render out of stock message when color is available", () => {
  render(<Product store={fakeStore} product={fakeProduct} />);
  userEvent.click(screen.getByLabelText(/gray/i));
  expect(
    screen.queryByText(/this color is currently sold out./i)
  ).not.toBeInTheDocument();
});

test('disable size button when sku is out of stock', () => {
  render(<Product store={fakeStore} product={fakeProduct} />);
  userEvent.click(screen.getByLabelText(/gray/i));
  expect(screen.getByLabelText(/small/i)).toBeDisabled();
});

test('render low inventory message when size is selected with inventory < 3', () => {
  render(<Product store={fakeStore} product={fakeProduct} />);
  userEvent.click(screen.getByLabelText(/gray/i));
  userEvent.click(screen.getByLabelText(/medium/i));
  expect(screen.getByText(/hurry! only a few left./i)).toBeInTheDocument();
});

test('render message when no size selected', () => {
  render(<Product store={fakeStore} product={fakeProduct} />);
  userEvent.click(screen.getByText(/add to order/i));
  expect(screen.getByText(/a size is required./i)).toBeInTheDocument();
});

test('render message when custom name is required', () => {
  render(<Product store={fakeStore} product={fakeProduct} />);
  userEvent.click(screen.getByLabelText(/medium/i));
  userEvent.click(
    screen.getByText(/select to add a name to the back of your apparel/i)
  );
  userEvent.click(screen.getByText(/add to order/i));
  expect(
    screen.queryByText(/name is required if selected./i)
  ).toBeInTheDocument();
});

test('render message when custom number is required', () => {
  render(<Product store={fakeStore} product={fakeProduct} />);
  userEvent.click(screen.getByLabelText(/medium/i));
  userEvent.click(
    screen.getByText(/select to add a number to the back of your apparel/i)
  );
  userEvent.click(screen.getByText(/add to order/i));
  expect(
    screen.queryByText(/number is required if selected./i)
  ).toBeInTheDocument();
});

test("don't render message when available size is added to cart", () => {
  render(<Product store={fakeStore} product={fakeProduct} />);
  userEvent.click(screen.getByLabelText(/medium/i));
  userEvent.click(screen.getByText(/add to order/i));
  expect(screen.queryByText(/a size is required./i)).not.toBeInTheDocument();
});

test("don't render message when name is selected and provided", () => {
  render(<Product store={fakeStore} product={fakeProduct} />);
  userEvent.click(screen.getByLabelText(/medium/i));
  userEvent.click(
    screen.getByText(/select to add a name to the back of your apparel/i)
  );
  userEvent.type(screen.getByLabelText(/name/i), 'sean');
  userEvent.click(screen.getByText(/add to order/i));
  expect(
    screen.queryByText(/number is required if selected./i)
  ).not.toBeInTheDocument();
});

test("don't render message when number is selected and provided", () => {
  render(<Product store={fakeStore} product={fakeProduct} />);
  userEvent.click(screen.getByLabelText(/medium/i));
  userEvent.click(
    screen.getByText(/select to add a number to the back of your apparel/i)
  );
  userEvent.type(screen.getByLabelText(/number/i), '12');
  userEvent.click(screen.getByText(/add to order/i));
  expect(
    screen.queryByText(/number is required if selected./i)
  ).not.toBeInTheDocument();
});
