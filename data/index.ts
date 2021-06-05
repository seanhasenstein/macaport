import { Store } from '../interfaces';

export const products = [
  {
    id: 'prod_907iSg8Fll9QBe',
    name: 'Short Sleeve Cotton T-Shirt',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
    primaryImage: '/images/tshirt.png',
    tag: 'Adult Sizes',
    price: 1500,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#d1d5db',
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
      },
    ],
    skus: [
      {
        id: 'sku_FR8KAXuBsi0dw7',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'S',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_qo5wK88nsWwEdz',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'S',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_No7gQX5ZI02kNw',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'S',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_X2uxt1FyuuN6zs',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'S',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_qeRabkgNukC3e5',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'M',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_GiKzqW4s0mwwBT',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'M',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_7sqrOA8gQNTyvW',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'M',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_UBxyzUMS6N2asa',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'M',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_I1LzL73gWTeC0i',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'L',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_Q5ZJk3WFbBPWx6',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'L',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_IGVexKg26ecY5u',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'L',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_FfZ3QvWixhZbZ4',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'L',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_eDdLQbD0AMi3BE',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'XL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_4GgC5IM71oXyH6',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'XL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_g8a6Z2s5B12WRP',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'XL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_roNsdeLvClGpCv',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'XL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_Tk5jsDXdAKwD9t',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'XXL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_0pi7CqY6W7UnZH',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'XXL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_p44Ui8upC72Fxp',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'XXL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_igvN6b1nJORft7',
        productId: 'prod_907iSg8Fll9QBe',
        size: 'XXL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
    ],
  },
  {
    id: 'prod_JfSTmprSYwKsVI',
    name: 'Short Sleeve Dri-FIT T-Shirt',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
    primaryImage: '/images/tshirt.png',
    tag: 'Adult Sizes',
    price: 1700,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#d1d5db',
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
      },
    ],
    skus: [
      {
        id: 'sku_2H0tv568W7bTch',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'S',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_Kr0uMS4bToL8TD',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'S',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_dQUu2XZJTjdTZ8',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'S',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_qaWotyDN3dIRbl',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'S',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_MkES7fTf3x2ruC',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'M',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_8AZRWZLajasvw4',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'M',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_tmrFPXFZrmGxuZ',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'M',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_ZjBQFUaz4fq0NK',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'M',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_F32XIRLumVDqTu',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'L',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_FQxJjc856oBz2s',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'L',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_azzWKdEChxUvDG',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'L',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_eXSs1ayMM7Kvo4',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'L',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_KKzBUb03bpII7z',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'XL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_PFlm1kVovFBTkZ',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'XL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_0rCnLPnT8sAjJi',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'XL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_TCsv4fPz6bP0y4',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'XL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_EFqEskvtBlEsV9',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'XXL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_yMzyi9pGeUnxPP',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'XXL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_uBKbVt2B5uuQc3',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'XXL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_711x2HUU1CBrwj',
        productId: 'prod_JfSTmprSYwKsVI',
        size: 'XXL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
    ],
  },
  {
    id: 'prod_CCzI7YiiWtMOcw',
    name: 'Long Sleeve Cotton T-Shirt',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
    primaryImage: '/images/long-sleeve.png',
    tag: 'Adult Sizes',
    price: 2200,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#d1d5db',
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
      },
    ],
    skus: [
      {
        id: 'sku_j001K6BOteZAD1',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'S',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_podzV7Zvt9QTnr',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'S',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_p7ZRUwEByd1lH0',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'S',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_rqaCmH1A987rRz',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'S',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_q1HtED5ZfEPlMd',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'M',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_27jqbg1az1j7UN',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'M',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_maAlCIVNC9zPeC',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'M',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_dXXNOrhLrgtqId',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'M',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_S17GGRNG2IPIYO',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'L',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_1m5svn7ly0bjrj',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'L',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_hZLSso1Ll3hzA5',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'L',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_po6K4QUbIkqiOz',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'L',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_io2F2ytKvwjm5a',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'XL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_8lhs4fF2qOaZ4G',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'XL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_Cq2VMUCcRu7SiR',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'XL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_6WzP4zEz0cNTQn',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'XL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_2oEvvw7tILpK2p',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'XXL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_FqQNnaS9T58gNA',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'XXL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_SkezFZLtUexoxB',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'XXL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_uZN43brG31HuAU',
        productId: 'prod_CCzI7YiiWtMOcw',
        size: 'XXL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
    ],
  },
  {
    id: 'prod_Ge0fnrFNtRrgQr',
    name: 'Cotton Crewneck Sweatshirt',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
    primaryImage: '/images/crewneck-sweatshirt.png',
    tag: 'Adult Sizes',
    price: 2800,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#d1d5db',
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
      },
    ],
    skus: [
      {
        id: 'sku_e2r3nqu7wmv6Vm',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'S',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_HE5h6pVCX1czkH',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'S',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_193KCXN3sljpGK',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'S',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_BVY8qN9AziFSJY',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'S',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_qH0178gD303bwa',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'M',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_1IbBPVT6SKsiLN',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'M',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_JffkPeOXUwotBN',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'M',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_EbIZv01PBOsup2',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'M',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_zJqi79YXNAvT14',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'L',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_WIIf1qjNLu8HTt',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'L',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_pa5p8KcBMRaS1C',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'L',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_GAvpOVIx6l1s34',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'L',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_IK1PJm44I5zo0C',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'XL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_Nnbw4ighJ5Eshs',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'XL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_I7F0yMT3T0eLgY',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'XL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_DL7kn9G7yZ0T2m',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'XL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_cMOkeGuoRe3u7x',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'XXL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_LlzPGgryRGed47',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'XXL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_FF5wusIrBjIAdn',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'XXL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_1T2SF4oHzOFkU2',
        productId: 'prod_Ge0fnrFNtRrgQr',
        size: 'XXL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
    ],
  },
  {
    id: 'prod_4HzlZ6w9on9v97',
    name: 'Cotton Hooded Sweatshirt',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
    primaryImage: '/images/hooded-sweatshirt.png',
    tag: 'Adult Sizes',
    price: 3000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#d1d5db',
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
      },
    ],
    skus: [
      {
        id: 'sku_wORVVC404sifc5',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'S',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_4z6VtttvRp3bVi',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'S',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_8Bb2AuK9b2fbT9',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'S',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_ex4RbFvnOc9Yoh',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'S',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_5zgymt6xwx2T8G',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'M',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_aejrTih5n5fpBv',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'M',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_W2qjv16FsnkF7C',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'M',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_J3Y6FzTOdlJFrH',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'M',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_9XBXBKxWnYk0sq',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'L',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_mht6lKI3e46dbl',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'L',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_04Pgaq9j2YqZcX',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'L',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_jdbtVGmeLdzBRv',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'L',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_KlwvE4uMxJxXRL',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'XL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_1JmRAHGaEXWUuX',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'XL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_rBRF9ceRkI2Dup',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'XL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_bpVoTaR3iY179f',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'XL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_FAsz85vYvINsp8',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'XXL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_BpWppAJYOflGzx',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'XXL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_HM9YV3RATImLmS',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'XXL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_5nM9SwhHX9ruPX',
        productId: 'prod_4HzlZ6w9on9v97',
        size: 'XXL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
    ],
  },
  {
    id: 'prod_VzkXZZP3gDMG7m',
    name: 'Dri-FIT Hooded Sweatshirt',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
    primaryImage: '/images/hooded-sweatshirt.png',
    tag: 'Adult Sizes',
    price: 4000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      {
        id: 1,
        label: 'White',
        hex: '#fff',
      },
      {
        id: 2,
        label: 'Grey',
        hex: '#d1d5db',
      },
      {
        id: 3,
        label: 'Navy',
        hex: '#003366',
      },
      {
        id: 4,
        label: 'Black',
        hex: '#000',
      },
    ],
    skus: [
      {
        id: 'sku_DU45iIfNsn0GFQ',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'S',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_kdAvU6cOGnxB25',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'S',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_AsAqqAuCCuHBXL',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'S',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_Q3t0iuzABsSKtO',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'S',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_3h2s5SmE15t3Eu',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'M',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_FF2rg5Q0tiVLoN',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'M',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_Z222EWO6OkxgC8',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'M',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_BnFiiHZoNF224w',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'M',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_QmsKR1YK0Il4Ma',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'L',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_jyPhm7llgqc93X',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'L',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_t4WKBvWNpGEPwW',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'L',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_m5RKP1yb8pmhy6',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'L',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_ygOZ4ijjWLLwob',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'XL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_mjsLTtGVHVqmU3',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'XL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_clGaCrGjjo8h3f',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'XL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_kEmJs0rRa45jfZ',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'XL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
      {
        id: 'sku_a8daqLxCW4KNI4',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'XXL',
        color: {
          id: 1,
          label: 'White',
          hex: '#fff',
        },
      },
      {
        id: 'sku_KqxDZsQfJGlc4v',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'XXL',
        color: {
          id: 2,
          label: 'Grey',
          hex: '#d1d5db',
        },
      },
      {
        id: 'sku_807JZ1zxWnf3ZY',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'XXL',
        color: {
          id: 3,
          label: 'Navy',
          hex: '#003366',
        },
      },
      {
        id: 'sku_6XcqJeKW3aKI5Y',
        productId: 'prod_VzkXZZP3gDMG7m',
        size: 'XXL',
        color: {
          id: 4,
          label: 'Black',
          hex: '#000',
        },
      },
    ],
  },
];

export const stores: Store[] = [
  {
    id: 'store_h8DUfQMxfyQrSt',
    name: 'This store should not show up, it is expired',
    slug: 'expired-store',
    startDate: '2021-05-29T05:00:00.000Z',
    closeDate: '2021-06-01T05:00:00.000Z',
    contact: {
      name: 'Nick Shaefer',
      email: 'nick@macaport.com',
      phone: '9201234567',
    },
    primaryShippingAddress: '1234 Test Street, New London, WI 54961',
    products: [
      {
        id: 'prod_ffd3wU9Ewgu7fL',
        name: 'Short Sleeve Cotton T-Shirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_h665I5S0bx7c1M',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_UuSscA6ru78yx4',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_cKbKbUAwu0uk10',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_ph3E98UHhjWpZp',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_fFNpUaCOZyr9o1',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_er1E2s7w3lNUiB',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_GQfzQSVUvAE26j',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_mqsUWCpjsSMzZw',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_cTebXgunePJf7N',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_1i5JkX2qwHGC6N',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_tARjmM5S1r0hMY',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_pwvxIUXuZT3hwp',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_6jfvPOKt4Gc3u6',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_CPixGu5jXwDz1e',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_xy8Y4uPelz7Y0i',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_6oWrNE9hc1YQy0',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_Ga2RVPVzutk95t',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_T2FGnnYi5UKd9l',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_lfKOu140sKUcCj',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_DuFoo3ZAMFIdJ1',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_XwAolbaSvqyTdH',
        name: 'Short Sleeve Dri-FIT T-Shirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_duy02g9jr5dLWl',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_ldrVPPFBkTUCT2',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Zf3AKYGJec9oCh',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_nX243LLQnOLDmn',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_YjHjTKtwXEXIrh',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_zN5jjZJP36yy9f',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_T22WWVsxOXTUXK',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_FgNUDT9TUHcaB5',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_5lYLV3vkLDHxab',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_DJ1r3EfIXv53ll',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_wMHCvPrrf88n0z',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_dnycgbZGea3kSW',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_Sx7QB4h0UvKaQ3',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_MuCXyJPaRqITSv',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_4lajNXv6WjnwXN',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_oEwroRjsxiUcbB',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_vP16RAtjstTiSO',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_WoKoc9s6w3lvx2',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_HDw6Y3XK55lsIp',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_eK0J5vSEJC5O4g',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_XcDFjny01zTNAT',
        name: 'Long Sleeve Cotton T-Shirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_MX7IlBrBrw77Gs',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_PTJZ0PaZAO9wGX',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_SUKIud7IVLegpj',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_2gpgXpoYrzbf4F',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_Xg0d4JVaPLNe2T',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_OTYJqtL3xzUrr3',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_xFeYgk22klwI12',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_Tu6eh68VyqTO9A',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_osThcApVqSWN4q',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_Hz7kfcraVRtUkq',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Bwaumd5Cn2HJSW',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_Cr4Yd2NR2ttbjt',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_BZ89174QbJmC3O',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_jWM7xuc96rbGZd',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_NOXlEmHDIsnZYo',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_25WanGXKYAE4YB',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_CDCb4SBDb4DM74',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_ie6Em6ONsDcGhu',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_RQe0GpG4iL6WkX',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_u7xm0Ri1Bw6LAx',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_qw43H9gmuNqfvW',
        name: 'Cotton Crewneck Sweatshirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_ccJMpKjF8yhMHt',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_K85xBMzfBnDqaA',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_0dAErTOhD5E5C3',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_Q2iFn7zczJ4tDv',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_pDvluPH49dCyLa',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_dVf1Tsnd3DPRck',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_7uIb0EROjKGrcp',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_xjhQJUIO7qvjiU',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_1X93iqTFslKTuy',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_x2hb9z856cN5MM',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_JRfnDI3XwAORwm',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_skkvfuZ4Z35EiG',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_fA00qxa03FDp9x',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_YM4RFajdMFiP7I',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_IlUhBY3NRcO4bX',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_JeYG0d1e54Us3g',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_7LS0ccErKZD3on',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_0mDeg7poshCSB0',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Fr68hnor98m31u',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_xbfnDFjA6Wgnqs',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_V73iqUHEDo0s06',
        name: 'Cotton Hooded Sweatshirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
        tag: 'Adult Sizes',
        price: 3000,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          {
            id: 1,
            label: 'White',
            hex: '#fff',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-white.jpg',
            secondaryImages: [],
          },
          {
            id: 2,
            label: 'Grey',
            hex: '#ccc',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-grey.jpg',
            secondaryImages: [],
          },
          {
            id: 3,
            label: 'Navy',
            hex: '#003366',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-navy.jpg',
            secondaryImages: [],
          },
          {
            id: 4,
            label: 'Black',
            hex: '#000',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-black.jpg',
            secondaryImages: [],
          },
        ],
        skus: [
          {
            id: 'sku_2MUecfrqFUtn9J',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_PtZLiKtNL7ea29',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_EmfhyYq650yeqJ',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_cZZFnmgT0W3jxW',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_kzLO0ueBlj5rUh',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_w1RQvYEBn6S6p0',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_BT5uYDSojUp4uc',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_RhsUeSRnau4sKF',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_C26OF55XXH3Cg5',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_G1NFB7y0RXZqjz',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_QciFlxZ5kHhKQE',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_vE57nzQGeqW9B7',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_u1kEmL4dkomvF1',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_zMbgxs4Fc4FIZT',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_U5qkImtO3NZEtt',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_qT4i1twa26h0Il',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_mGv1344w35mQ4t',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_18hSV6qSoNAc7T',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_DV6KDPYU04zR5R',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_8qePskGkuO5iMM',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_w8sEkG7vo170oA',
        name: 'Dri-FIT Hooded Sweatshirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-dri-fit-grey.jpg',
            secondaryImages: [],
          },
          {
            id: 3,
            label: 'Navy',
            hex: '#003366',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-dri-fit-navy.jpg',
            secondaryImages: [],
          },
        ],
        skus: [
          {
            id: 'sku_7uLu6tgg1e6A3y',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_xJOS7dBxk4FANx',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_bXhlZC6xCe8ORg',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_mUEUAXQub4T1vH',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_TSbdBchTS6UtXs',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_ZqFI696PppeXST',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_J87eGLSR7xJfnB',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_yDlRDgCnAlppFA',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Eckd7Ouy7I74Kz',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_MkG2HXmSky8tka',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_U0x7kfLlZg5TWa',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_h3RTcfqWRPXKuH',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_6CvuVxLPVP66Am',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_qKv7ePZFAN9jaD',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_piH6oUmPWm9cwK',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
        ],
      },
    ],
    // orders: [orders will go here...],
    createdAt: '2021-05-28T02:00:12.149Z',
    updatedAt: '2021-05-28T02:00:12.149Z',
  },
  {
    id: 'store_h8DUfQMxfy3vkK',
    name: 'Macaport Demo Apparel Store',
    slug: 'macaport-demo-apparel-store',
    startDate: '2021-05-29T05:00:00.000Z',
    closeDate: '2021-08-01T05:00:00.000Z',
    contact: {
      name: 'Nick Shaefer',
      email: 'nick@macaport.com',
      phone: '9201234567',
    },
    primaryShippingAddress: '1234 Test Street, New London, WI 54961',
    products: [
      {
        id: 'prod_ffd3wU9Ewgu7fL',
        name: 'Short Sleeve Cotton T-Shirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_h665I5S0bx7c1M',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_UuSscA6ru78yx4',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_cKbKbUAwu0uk10',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_ph3E98UHhjWpZp',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_fFNpUaCOZyr9o1',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_er1E2s7w3lNUiB',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_GQfzQSVUvAE26j',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_mqsUWCpjsSMzZw',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_cTebXgunePJf7N',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_1i5JkX2qwHGC6N',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_tARjmM5S1r0hMY',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_pwvxIUXuZT3hwp',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_6jfvPOKt4Gc3u6',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_CPixGu5jXwDz1e',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_xy8Y4uPelz7Y0i',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_6oWrNE9hc1YQy0',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_Ga2RVPVzutk95t',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_T2FGnnYi5UKd9l',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_lfKOu140sKUcCj',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_DuFoo3ZAMFIdJ1',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_XwAolbaSvqyTdH',
        name: 'Short Sleeve Dri-FIT T-Shirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_duy02g9jr5dLWl',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_ldrVPPFBkTUCT2',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Zf3AKYGJec9oCh',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_nX243LLQnOLDmn',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_YjHjTKtwXEXIrh',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_zN5jjZJP36yy9f',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_T22WWVsxOXTUXK',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_FgNUDT9TUHcaB5',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_5lYLV3vkLDHxab',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_DJ1r3EfIXv53ll',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_wMHCvPrrf88n0z',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_dnycgbZGea3kSW',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_Sx7QB4h0UvKaQ3',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_MuCXyJPaRqITSv',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_4lajNXv6WjnwXN',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_oEwroRjsxiUcbB',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_vP16RAtjstTiSO',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_WoKoc9s6w3lvx2',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_HDw6Y3XK55lsIp',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_eK0J5vSEJC5O4g',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_XcDFjny01zTNAT',
        name: 'Long Sleeve Cotton T-Shirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_MX7IlBrBrw77Gs',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_PTJZ0PaZAO9wGX',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_SUKIud7IVLegpj',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_2gpgXpoYrzbf4F',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_Xg0d4JVaPLNe2T',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_OTYJqtL3xzUrr3',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_xFeYgk22klwI12',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_Tu6eh68VyqTO9A',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_osThcApVqSWN4q',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_Hz7kfcraVRtUkq',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Bwaumd5Cn2HJSW',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_Cr4Yd2NR2ttbjt',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_BZ89174QbJmC3O',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_jWM7xuc96rbGZd',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_NOXlEmHDIsnZYo',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_25WanGXKYAE4YB',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_CDCb4SBDb4DM74',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_ie6Em6ONsDcGhu',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_RQe0GpG4iL6WkX',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_u7xm0Ri1Bw6LAx',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_qw43H9gmuNqfvW',
        name: 'Cotton Crewneck Sweatshirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_ccJMpKjF8yhMHt',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_K85xBMzfBnDqaA',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_0dAErTOhD5E5C3',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_Q2iFn7zczJ4tDv',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_pDvluPH49dCyLa',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_dVf1Tsnd3DPRck',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_7uIb0EROjKGrcp',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_xjhQJUIO7qvjiU',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_1X93iqTFslKTuy',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_x2hb9z856cN5MM',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_JRfnDI3XwAORwm',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_skkvfuZ4Z35EiG',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_fA00qxa03FDp9x',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_YM4RFajdMFiP7I',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_IlUhBY3NRcO4bX',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_JeYG0d1e54Us3g',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_7LS0ccErKZD3on',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_0mDeg7poshCSB0',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Fr68hnor98m31u',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_xbfnDFjA6Wgnqs',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_V73iqUHEDo0s06',
        name: 'Cotton Hooded Sweatshirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
        tag: 'Adult Sizes',
        price: 3000,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          {
            id: 1,
            label: 'White',
            hex: '#fff',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-white.jpg',
            secondaryImages: [],
          },
          {
            id: 2,
            label: 'Grey',
            hex: '#ccc',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-grey.jpg',
            secondaryImages: [],
          },
          {
            id: 3,
            label: 'Navy',
            hex: '#003366',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-navy.jpg',
            secondaryImages: [],
          },
          {
            id: 4,
            label: 'Black',
            hex: '#000',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-black.jpg',
            secondaryImages: [],
          },
        ],
        skus: [
          {
            id: 'sku_2MUecfrqFUtn9J',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_PtZLiKtNL7ea29',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_EmfhyYq650yeqJ',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_cZZFnmgT0W3jxW',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_kzLO0ueBlj5rUh',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_w1RQvYEBn6S6p0',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_BT5uYDSojUp4uc',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_RhsUeSRnau4sKF',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_C26OF55XXH3Cg5',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_G1NFB7y0RXZqjz',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_QciFlxZ5kHhKQE',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_vE57nzQGeqW9B7',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_u1kEmL4dkomvF1',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_zMbgxs4Fc4FIZT',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_U5qkImtO3NZEtt',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_qT4i1twa26h0Il',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_mGv1344w35mQ4t',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_18hSV6qSoNAc7T',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_DV6KDPYU04zR5R',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_8qePskGkuO5iMM',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_w8sEkG7vo170oA',
        name: 'Dri-FIT Hooded Sweatshirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-dri-fit-grey.jpg',
            secondaryImages: [],
          },
          {
            id: 3,
            label: 'Navy',
            hex: '#003366',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-dri-fit-navy.jpg',
            secondaryImages: [],
          },
        ],
        skus: [
          {
            id: 'sku_7uLu6tgg1e6A3y',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_xJOS7dBxk4FANx',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_bXhlZC6xCe8ORg',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_mUEUAXQub4T1vH',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_TSbdBchTS6UtXs',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_ZqFI696PppeXST',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_J87eGLSR7xJfnB',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_yDlRDgCnAlppFA',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Eckd7Ouy7I74Kz',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_MkG2HXmSky8tka',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_U0x7kfLlZg5TWa',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_h3RTcfqWRPXKuH',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_6CvuVxLPVP66Am',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_qKv7ePZFAN9jaD',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_piH6oUmPWm9cwK',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
        ],
      },
    ],
    // orders: [orders will go here...],
    createdAt: '2021-05-28T02:00:12.149Z',
    updatedAt: '2021-05-28T02:00:12.149Z',
  },
  {
    id: 'store_abcdfQMxfy3vkK',
    name: 'New London HS Cross Country',
    slug: 'new-london-hs-cross-country',
    startDate: '2021-05-29T05:00:00.000Z',
    closeDate: null,
    contact: {
      name: 'Nick Shaefer',
      email: 'nick@macaport.com',
      phone: '9201234567',
    },
    primaryShippingAddress: '1234 Test Street, New London, WI 54961',
    products: [
      {
        id: 'prod_ffd3wU9Ewgu7fL',
        name: 'Short Sleeve Cotton T-Shirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_h665I5S0bx7c1M',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_UuSscA6ru78yx4',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_cKbKbUAwu0uk10',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_ph3E98UHhjWpZp',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_fFNpUaCOZyr9o1',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_er1E2s7w3lNUiB',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_GQfzQSVUvAE26j',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_mqsUWCpjsSMzZw',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_cTebXgunePJf7N',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_1i5JkX2qwHGC6N',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_tARjmM5S1r0hMY',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_pwvxIUXuZT3hwp',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_6jfvPOKt4Gc3u6',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_CPixGu5jXwDz1e',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_xy8Y4uPelz7Y0i',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_6oWrNE9hc1YQy0',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_Ga2RVPVzutk95t',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_T2FGnnYi5UKd9l',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_lfKOu140sKUcCj',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_DuFoo3ZAMFIdJ1',
            productId: 'prod_ffd3wU9Ewgu7fL',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_XwAolbaSvqyTdH',
        name: 'Short Sleeve Dri-FIT T-Shirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_duy02g9jr5dLWl',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_ldrVPPFBkTUCT2',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Zf3AKYGJec9oCh',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_nX243LLQnOLDmn',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_YjHjTKtwXEXIrh',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_zN5jjZJP36yy9f',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_T22WWVsxOXTUXK',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_FgNUDT9TUHcaB5',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_5lYLV3vkLDHxab',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_DJ1r3EfIXv53ll',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_wMHCvPrrf88n0z',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_dnycgbZGea3kSW',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_Sx7QB4h0UvKaQ3',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_MuCXyJPaRqITSv',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_4lajNXv6WjnwXN',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_oEwroRjsxiUcbB',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_vP16RAtjstTiSO',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_WoKoc9s6w3lvx2',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_HDw6Y3XK55lsIp',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_eK0J5vSEJC5O4g',
            productId: 'prod_XwAolbaSvqyTdH',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_XcDFjny01zTNAT',
        name: 'Long Sleeve Cotton T-Shirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_MX7IlBrBrw77Gs',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_PTJZ0PaZAO9wGX',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_SUKIud7IVLegpj',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_2gpgXpoYrzbf4F',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_Xg0d4JVaPLNe2T',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_OTYJqtL3xzUrr3',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_xFeYgk22klwI12',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_Tu6eh68VyqTO9A',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_osThcApVqSWN4q',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_Hz7kfcraVRtUkq',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Bwaumd5Cn2HJSW',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_Cr4Yd2NR2ttbjt',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_BZ89174QbJmC3O',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_jWM7xuc96rbGZd',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_NOXlEmHDIsnZYo',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_25WanGXKYAE4YB',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_CDCb4SBDb4DM74',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_ie6Em6ONsDcGhu',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_RQe0GpG4iL6WkX',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_u7xm0Ri1Bw6LAx',
            productId: 'prod_XcDFjny01zTNAT',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_qw43H9gmuNqfvW',
        name: 'Cotton Crewneck Sweatshirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
        skus: [
          {
            id: 'sku_ccJMpKjF8yhMHt',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_K85xBMzfBnDqaA',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_0dAErTOhD5E5C3',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_Q2iFn7zczJ4tDv',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_pDvluPH49dCyLa',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_dVf1Tsnd3DPRck',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_7uIb0EROjKGrcp',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_xjhQJUIO7qvjiU',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_1X93iqTFslKTuy',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_x2hb9z856cN5MM',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_JRfnDI3XwAORwm',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_skkvfuZ4Z35EiG',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_fA00qxa03FDp9x',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_YM4RFajdMFiP7I',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_IlUhBY3NRcO4bX',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_JeYG0d1e54Us3g',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_7LS0ccErKZD3on',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_0mDeg7poshCSB0',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Fr68hnor98m31u',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_xbfnDFjA6Wgnqs',
            productId: 'prod_qw43H9gmuNqfvW',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_V73iqUHEDo0s06',
        name: 'Cotton Hooded Sweatshirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
        tag: 'Adult Sizes',
        price: 3000,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          {
            id: 1,
            label: 'White',
            hex: '#fff',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-white.jpg',
            secondaryImages: [],
          },
          {
            id: 2,
            label: 'Grey',
            hex: '#ccc',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-grey.jpg',
            secondaryImages: [],
          },
          {
            id: 3,
            label: 'Navy',
            hex: '#003366',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-navy.jpg',
            secondaryImages: [],
          },
          {
            id: 4,
            label: 'Black',
            hex: '#000',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-cotton-black.jpg',
            secondaryImages: [],
          },
        ],
        skus: [
          {
            id: 'sku_2MUecfrqFUtn9J',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_PtZLiKtNL7ea29',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_EmfhyYq650yeqJ',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_cZZFnmgT0W3jxW',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'S',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_kzLO0ueBlj5rUh',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_w1RQvYEBn6S6p0',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_BT5uYDSojUp4uc',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_RhsUeSRnau4sKF',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'M',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_C26OF55XXH3Cg5',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_G1NFB7y0RXZqjz',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_QciFlxZ5kHhKQE',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_vE57nzQGeqW9B7',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'L',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_u1kEmL4dkomvF1',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_zMbgxs4Fc4FIZT',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_U5qkImtO3NZEtt',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_qT4i1twa26h0Il',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XL',
            color: { id: 4, label: 'Black' },
          },
          {
            id: 'sku_mGv1344w35mQ4t',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_18hSV6qSoNAc7T',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_DV6KDPYU04zR5R',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_8qePskGkuO5iMM',
            productId: 'prod_V73iqUHEDo0s06',
            size: 'XXL',
            color: { id: 4, label: 'Black' },
          },
        ],
      },
      {
        id: 'prod_w8sEkG7vo170oA',
        name: 'Dri-FIT Hooded Sweatshirt',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum sagittis nibh vitae dignissim. Suspendisse et turpis efficitur, eleifend leo sed, consectetur ligula.',
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
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-dri-fit-grey.jpg',
            secondaryImages: [],
          },
          {
            id: 3,
            label: 'Navy',
            hex: '#003366',
            primaryImage:
              '/images/stores/new-london-hs-cc/hooded-dri-fit-navy.jpg',
            secondaryImages: [],
          },
        ],
        skus: [
          {
            id: 'sku_7uLu6tgg1e6A3y',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'S',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_xJOS7dBxk4FANx',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'S',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_bXhlZC6xCe8ORg',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'S',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_mUEUAXQub4T1vH',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'M',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_TSbdBchTS6UtXs',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'M',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_ZqFI696PppeXST',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'M',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_J87eGLSR7xJfnB',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'L',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_yDlRDgCnAlppFA',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'L',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_Eckd7Ouy7I74Kz',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'L',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_MkG2HXmSky8tka',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_U0x7kfLlZg5TWa',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_h3RTcfqWRPXKuH',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XL',
            color: { id: 3, label: 'Navy' },
          },
          {
            id: 'sku_6CvuVxLPVP66Am',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XXL',
            color: { id: 1, label: 'White' },
          },
          {
            id: 'sku_qKv7ePZFAN9jaD',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XXL',
            color: { id: 2, label: 'Grey' },
          },
          {
            id: 'sku_piH6oUmPWm9cwK',
            productId: 'prod_w8sEkG7vo170oA',
            size: 'XXL',
            color: { id: 3, label: 'Navy' },
          },
        ],
      },
    ],
    // orders: [orders will go here...],
    createdAt: '2021-05-28T02:00:12.149Z',
    updatedAt: '2021-05-28T02:00:12.149Z',
  },
];

// const order = {
//   _id: '60b3dfd9fe479900099c75a4',
//   orderId: '77413-10337',
//   items: [],
//   customer: {
//     firstName: 'Sean',
//     lastName: 'Hasenstein',
//     email: 'seanhasenstein@gmail.com',
//   },
//   summary: {
//     subtotal: 2800,
//     shipping: 0,
//     salesTax: 154,
//     total: 2954,
//   },
//   shippingAddress: '3201 Playbird Rd, Sheboygan, WI 53083',
//   transactionId: '2157047189',
//   createdAt: '2021-05-30T18:56:23.862Z',
//   updatedAt: '2021-05-30T18:56:23.862Z',
// };

// const orderItem = {
//   id: 'sku_JffkPeOXUwotBN',
//   name: 'Cotton Crewneck Sweatshirt',
//   genders: ['Men', 'Women'],
//   primaryImage: '/images/crewneck.png',
//   price: 2800,
//   color: 'Navy',
//   size: 'M',
//   quantity: 1,
//   itemTotal: 2800,
// };
