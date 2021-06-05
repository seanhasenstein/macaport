import { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from 'crypto';

interface SecondaryImage {
  id: number;
  url: string;
  alt: string;
}

interface Color {
  id: number;
  label: string;
  hex: string;
  primaryImage: string;
  secondaryImages: SecondaryImage[];
}

type SkuColor = Omit<Color, 'hex' | 'primaryImage' | 'secondaryImages'>;

interface ProductInput {
  name: string;
  description: string;
  tag: string;
  price: number;
  sizes: string[];
  colors: Color[];
}

interface Product extends ProductInput {
  id: string;
  skus: Sku[];
}

interface Sku {
  id: string;
  productId: Product['id'];
  size: string;
  color: SkuColor;
}

const ALPHA_NUM =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function createId(prefix: string, len = 14) {
  const rnd = crypto.randomBytes(len);
  const value = new Array(len);
  const charsLength = ALPHA_NUM.length;

  for (let i = 0; i < len; i++) {
    value[i] = ALPHA_NUM[rnd[i] % charsLength];
  }

  const id = value.join('');

  return `${prefix}_${id}`;
}

function createSkusFromSizesAndColors(
  sizes: string[],
  colors: Color[],
  productId: string
) {
  let skus: Sku[] = [];

  sizes.forEach(s => {
    const skusResult = colors.map(c => {
      const id = createId('sku');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hex, primaryImage, secondaryImages, ...color } = c;
      return { id, productId, size: s, color };
    });

    skus = [...skus, ...skusResult];
  });

  console.log('skus: ', skus);
  return skus;
}

function createProduct({
  name,
  description,
  tag,
  price,
  sizes,
  colors,
}: ProductInput): Product {
  const id = createId('prod');
  const skus = createSkusFromSizesAndColors(sizes, colors, id);

  return {
    id,
    name,
    description,
    tag,
    price,
    sizes,
    colors,
    skus,
  };
}

const description =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.';

const products: ProductInput[] = [
  {
    name: 'Short Sleeve Cotton T-Shirt',
    description,
    tag: 'Adult Sizes',
    price: 1500,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
        primaryImage:
          '/images/stores/new-london-hs-cc/short-sleeve-cotton-white.jpg',
        secondaryImages: [
          {
            id: 1,
            url: '/images/stores/new-london-hs-cc/short-sleeve-cotton-white.jpg',
            alt: 'Back of white short sleeve cotton t-shirt',
          },
          {
            id: 2,
            url: '/images/stores/new-london-hs-cc/short-sleeve-cotton-white.jpg',
            alt: 'Side of white short sleeve cotton t-shirt',
          },
        ],
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#ccc',
        primaryImage:
          '/images/stores/new-london-hs-cc/short-sleeve-cotton-grey.jpg',
        secondaryImages: [
          {
            id: 1,
            url: '/images/stores/new-london-hs-cc/short-sleeve-cotton-grey.jpg',
            alt: 'Back of white short sleeve cotton t-shirt',
          },
          {
            id: 2,
            url: '/images/stores/new-london-hs-cc/short-sleeve-cotton-grey.jpg',
            alt: 'Side of white short sleeve cotton t-shirt',
          },
        ],
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
        primaryImage:
          '/images/stores/new-london-hs-cc/short-sleeve-cotton-navy.jpg',
        secondaryImages: [
          {
            id: 1,
            url: '/images/stores/new-london-hs-cc/short-sleeve-cotton-navy.jpg',
            alt: 'Back of white short sleeve cotton t-shirt',
          },
          {
            id: 2,
            url: '/images/stores/new-london-hs-cc/short-sleeve-cotton-navy.jpg',
            alt: 'Side of white short sleeve cotton t-shirt',
          },
        ],
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
        primaryImage:
          '/images/stores/new-london-hs-cc/short-sleeve-cotton-black.jpg',
        secondaryImages: [
          {
            id: 1,
            url: '/images/stores/new-london-hs-cc/short-sleeve-cotton-black.jpg',
            alt: 'Back of white short sleeve cotton t-shirt',
          },
          {
            id: 2,
            url: '/images/stores/new-london-hs-cc/short-sleeve-cotton-black.jpg',
            alt: 'Side of white short sleeve cotton t-shirt',
          },
        ],
      },
    ],
  },
  {
    name: 'Short Sleeve Dri-FIT T-Shirt',
    description,
    tag: 'Adult Sizes',
    price: 1700,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
        primaryImage:
          '/images/stores/new-london-hs-cc/short-sleeve-dri-fit-white.jpg',
        secondaryImages: [],
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#ccc',
        primaryImage:
          '/images/stores/new-london-hs-cc/short-sleeve-dri-fit-grey.jpg',
        secondaryImages: [],
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
        primaryImage:
          '/images/stores/new-london-hs-cc/short-sleeve-dri-fit-navy.jpg',
        secondaryImages: [],
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
        primaryImage:
          '/images/stores/new-london-hs-cc/short-sleeve-dri-fit-black.jpg',
        secondaryImages: [],
      },
    ],
  },
  {
    name: 'Long Sleeve Cotton T-Shirt',
    description,
    tag: 'Adult Sizes',
    price: 2200,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
        primaryImage:
          '/images/stores/new-london-hs-cc/long-sleeve-cotton-white.jpg',
        secondaryImages: [],
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#ccc',
        primaryImage:
          '/images/stores/new-london-hs-cc/long-sleeve-cotton-grey.jpg',
        secondaryImages: [],
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
        primaryImage:
          '/images/stores/new-london-hs-cc/long-sleeve-cotton-navy.jpg',
        secondaryImages: [],
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
        primaryImage:
          '/images/stores/new-london-hs-cc/long-sleeve-cotton-black.jpg',
        secondaryImages: [],
      },
    ],
  },
  {
    name: 'Cotton Crewneck Sweatshirt',
    description,
    tag: 'Adult Sizes',
    price: 2800,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
        primaryImage:
          '/images/stores/new-london-hs-cc/crewneck-cotton-white.jpg',
        secondaryImages: [],
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#ccc',
        primaryImage:
          '/images/stores/new-london-hs-cc/crewneck-cotton-grey.jpg',
        secondaryImages: [],
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
        primaryImage:
          '/images/stores/new-london-hs-cc/crewneck-cotton-navy.jpg',
        secondaryImages: [],
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
        primaryImage:
          '/images/stores/new-london-hs-cc/crewneck-cotton-black.jpg',
        secondaryImages: [],
      },
    ],
  },
  {
    name: 'Cotton Hooded Sweatshirt',
    description,
    tag: 'Adult Sizes',
    price: 3000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
        primaryImage: '/images/stores/new-london-hs-cc/hooded-cotton-white.jpg',
        secondaryImages: [],
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#ccc',
        primaryImage: '/images/stores/new-london-hs-cc/hooded-cotton-grey.jpg',
        secondaryImages: [],
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
        primaryImage: '/images/stores/new-london-hs-cc/hooded-cotton-navy.jpg',
        secondaryImages: [],
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
        primaryImage: '/images/stores/new-london-hs-cc/hooded-cotton-black.jpg',
        secondaryImages: [],
      },
    ],
  },
  {
    name: 'Dri-FIT Hooded Sweatshirt',
    description,
    tag: 'Adult Sizes',
    price: 4000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
        primaryImage:
          '/images/stores/new-london-hs-cc/hooded-dri-fit-white.jpg',
        secondaryImages: [],
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#ccc',
        primaryImage: '/images/stores/new-london-hs-cc/hooded-dri-fit-grey.jpg',
        secondaryImages: [],
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
        primaryImage: '/images/stores/new-london-hs-cc/hooded-dri-fit-navy.jpg',
        secondaryImages: [],
      },
    ],
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = products.map(p => {
    return createProduct({
      name: p.name,
      description: p.description,
      tag: p.tag,
      price: p.price,
      sizes: p.sizes,
      colors: p.colors,
    });
  });

  res.status(200).json({ result });
}
