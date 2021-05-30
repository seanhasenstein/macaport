import { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from 'crypto';

interface Color {
  id: number;
  label: string;
  hex: string;
}

interface ProductInput {
  name: string;
  description: string;
  image: string;
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
  color: Color;
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

// function createSkusArray(skus: string[], productId: string) {
//   return skus.map(sku => {
//     const id = createId('sku');

//     return { id, productId, size: sku };
//   });
// }

function createSkusFromSizeAndColor(
  sizes: string[],
  colors: Color[],
  productId: string
) {
  // Every size -> color combo needs to be assigned as a sku
  // iterate over sizes
  // for every size iterate over every color
  // asign the sku

  // need to return an array of skus

  let skus: Sku[] = [];

  sizes.forEach(s => {
    const skusResult = colors.map(c => {
      const id = createId('sku');
      return { id, productId, size: s, color: c };
    });

    skus = [...skus, ...skusResult];
  });

  console.log('skus: ', skus);
  return skus;
}

function createProduct({
  name,
  description,
  image,
  tag,
  price,
  sizes,
  colors,
}: ProductInput): Product {
  const id = createId('prod');
  const skus = createSkusFromSizeAndColor(sizes, colors, id);

  return {
    id,
    name,
    description,
    image,
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
    image: '/images/tshirt.png',
    tag: 'Adult Sizes',
    price: 1500,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 1, label: 'White', hex: '#fff' },
      { id: 2, label: 'Grey', hex: '#ccc' },
      { id: 3, label: 'Navy', hex: '#003366' },
      { id: 4, label: 'Black', hex: '#000' },
    ],
  },
  {
    name: 'Short Sleeve Dri-FIT T-Shirt',
    description,
    image: '/images/tshirt.png',
    tag: 'Adult Sizes',
    price: 1700,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 1, label: 'White', hex: '#fff' },
      { id: 2, label: 'Grey', hex: '#ccc' },
      { id: 3, label: 'Navy', hex: '#003366' },
      { id: 4, label: 'Black', hex: '#000' },
    ],
  },
  {
    name: 'Long Sleeve Cotton T-Shirt',
    description,
    image: '/images/long-sleeve.png',
    tag: 'Adult Sizes',
    price: 2200,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 1, label: 'White', hex: '#fff' },
      { id: 2, label: 'Grey', hex: '#ccc' },
      { id: 3, label: 'Navy', hex: '#003366' },
      { id: 4, label: 'Black', hex: '#000' },
    ],
  },
  {
    name: 'Cotton Crewneck Sweatshirt',
    description,
    image: '/images/crewneck-sweatshirt.png',
    tag: 'Adult Sizes',
    price: 2800,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 1, label: 'White', hex: '#fff' },
      { id: 2, label: 'Grey', hex: '#ccc' },
      { id: 3, label: 'Navy', hex: '#003366' },
      { id: 4, label: 'Black', hex: '#000' },
    ],
  },
  {
    name: 'Cotton Hooded Sweatshirt',
    description,
    image: '/images/hooded-sweatshirt.png',
    tag: 'Adult Sizes',
    price: 3000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 1, label: 'White', hex: '#fff' },
      { id: 2, label: 'Grey', hex: '#ccc' },
      { id: 3, label: 'Navy', hex: '#003366' },
      { id: 4, label: 'Black', hex: '#000' },
    ],
  },
  {
    name: 'Dri-FIT Hooded Sweatshirt',
    description,
    image: '/images/hooded-sweatshirt.png',
    tag: 'Adult Sizes',
    price: 4000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { id: 1, label: 'White', hex: '#fff' },
      { id: 2, label: 'Grey', hex: '#ccc' },
      { id: 3, label: 'Navy', hex: '#003366' },
      { id: 4, label: 'Black', hex: '#000' },
    ],
  },
];

// const products = [
//   {
//     name: 'Cotton Crewneck Sweatshirt',
//     description,
//     image: '/images/crewneck-sweatshirt.png',
//     tag: 'Adult Sizes',
//     price: 2800,
//     sizes: ['S', 'M', 'L', 'XL', 'XXL'],
//     colors: [
//       { id: 1, label: 'White', hex: '#fff' },
//       { id: 2, label: 'Grey', hex: '#ccc' },
//       { id: 3, label: 'Navy', hex: '#003366' },
//       { id: 4, label: 'Black', hex: '#000' },
//     ],
//   },
// ];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = products.map(p => {
    return createProduct({
      name: p.name,
      description: p.description,
      image: p.image,
      tag: p.tag,
      price: p.price,
      sizes: p.sizes,
      colors: p.colors,
    });
  });

  res.status(200).json({ result });
}
