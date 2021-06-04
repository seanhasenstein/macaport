import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useCart } from '../../../hooks/useCart';
import { Store, Item } from '../../../interfaces';
import { formatToMoney } from '../../../utils';
import StoreLayout from '../../../components/store/StoreLayout';
import ProductSidebar from '../../../components/store/ProductSidebar';
import { stores } from '../../../data';

type Props = {
  store: Store;
  product: Item;
  active: boolean;
  error: string;
};

type ColorProps = {
  label: string;
  hex: string;
  color: string;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ColorStyles = styled.div`
  margin: 0 0.875rem 0 0;
  position: relative;
  height: 2.5rem;
  width: 2.5rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.15) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
  border-radius: 9999px;

  &.checked {
    padding: 0.125rem;
    border: 2px solid #3730a3;
  }

  label {
    display: flex;
    height: 100%;
    width: 100%;
    border-radius: 9999px;
    background-color: ${(props: ColorProps) => props.hex};
    cursor: pointer;
  }

  input {
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
`;

const Color = (props: ColorProps) => (
  <ColorStyles
    {...props}
    className={props.color === props.label ? 'checked' : ''}
    title={props.label}
  >
    <label htmlFor={props.label}>
      <span className="sr-only">{props.label}</span>
    </label>
    <input
      type="radio"
      name={props.label}
      id={props.label}
      value={props.label}
      onChange={props.handleColorChange}
      checked={props.color === props.label}
      tabIndex={-1}
    />
  </ColorStyles>
);

const ProductStyles = styled.div`
  padding: 3rem 1.5rem;

  .wrapper {
    margin: 0 auto;
    max-width: 75rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 0.8fr;
    gap: 1.875rem 3rem;
    grid-template-areas:
      'images primary'
      'images colors'
      'images sizes'
      'images actions'
      'images details';
  }

  .images {
    grid-area: images;
    display: flex;
    flex-direction: column;
    align-items: center;

    .primary-img {
      padding: 3rem 2rem;
      width: 100%;
      background-color: #fff;
      text-align: center;
      border: 1px solid #e5e7eb;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

      img {
        max-width: 24rem;
        width: 100%;
      }
    }

    .secondary-imgs {
      margin: 1rem 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
      gap: 1rem;
      width: 100%;

      > div {
        padding: 2rem;
        background-color: #fff;
        border: 1px solid #e5e7eb;
        box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

        img {
          width: 100%;
        }
      }
    }
  }

  .primary {
    grid-area: primary;
    display: flex;
    justify-content: space-between;
  }

  .name {
    margin: 0 1.5rem 0 0;
    font-size: 1.25rem;
    font-weight: 500;
    color: #111827;
  }

  .price {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  h4 {
    margin: 0 0 1rem;
    font-weight: 500;
    font-size: 1rem;
    color: #111827;
  }

  .colors {
    grid-area: colors;

    .grid {
      max-width: 18rem;
      width: 100%;
      display: flex;
      list-style-type: none;
    }
  }

  .sizes {
    grid-area: sizes;

    .grid {
      display: grid;
      grid-auto-flow: column;
      gap: 0.875rem;
    }

    .size {
      margin: 0;
      position: relative;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;

      label {
        margin: 0;
        padding: 0.625rem 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.9375rem;
        letter-spacing: 0.0375em;
        color: #111827;
        cursor: pointer;
        text-align: center;
      }

      &.checked {
        background-color: #202329;
        border-color: #202329;

        label {
          color: #fff;
        }
      }

      &:hover {
        border-color: #656e81;
      }

      input {
        margin: 0;
        padding: 0;
        height: 1px;
        width: 1px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: transparent;
        border: none;
        box-shadow: none;
      }
    }
  }

  .actions {
    grid-area: actions;
  }

  button {
    padding: 0.75rem 1.25rem;
    width: 100%;
    height: 2.625rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #202329;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.011em;
    border: 1px solid #181a1e;
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    cursor: pointer;
    transition: all 150ms ease-in-out;

    &:hover {
      background-color: #181a1e;
      color: rgba(255, 255, 255, 1);
    }
  }

  .details {
    grid-area: details;
  }

  .description {
    padding: 1.875rem 0;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;

    p {
      margin: 0;
      line-height: 1.5;
      color: #4b5563;
    }
  }

  .other-details {
    padding: 1.875rem 0;

    ul {
      margin: 0;
      padding: 0 0 0 1.125rem;
    }

    li {
      margin: 0 0 0.5rem;
      color: #4b5563;

      &:last-of-type {
        margin: 0;
      }
    }
  }

  .error {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #de1d3b;
  }

  @media (max-width: 700px) {
    padding: 2rem 1.5rem;

    .wrapper {
      grid-template-columns: 1fr;
      grid-template-areas:
        'primary'
        'images'
        'colors'
        'sizes'
        'actions'
        'details';
    }

    .name {
      font-size: 1.125rem;
    }
  }
`;

export default function Product({ store, product, active, error }: Props) {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [color, setColor] = React.useState(() => {
    if (router.query.color) {
      return Array.isArray(router.query.color)
        ? router.query.color[0]
        : router.query.color;
    } else {
      return product.colors[0].label;
    }
  });
  const [primaryImage, setPrimaryImage] = React.useState(() => {
    const c = product.colors.find(c => c.label === color);
    return c?.image;
  });
  const [size, setSize] = React.useState('DEFAULT');
  const [validationError, setValidationError] = React.useState<string>();
  const { addItem } = useCart();

  React.useEffect(() => {
    router.push(
      `/store/${store.slug}/${product.id}?color=${color}`,
      undefined,
      { shallow: true }
    );
    setPrimaryImage(() => {
      const c = product.colors.find(c => c.label === color);
      return c?.image;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationError && e.target.value !== 'DEFAULT')
      setValidationError(undefined);

    setSize(e.target.value);
  };

  const handleButtonClick = () => {
    if (size === 'DEFAULT') {
      setValidationError('Please select a size');
      return;
    }

    const sku = product.skus.find(
      sku => sku.size === size && sku.color.label === color
    );

    // todo: figure out what to do when no sku or item is found
    if (sku)
      addItem({
        ...product,
        id: sku.id,
        productId: product.id,
        color,
        size,
      });
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!active) {
    return <div>This store is inactive.</div>;
  }

  return (
    <StoreLayout
      storeId={store.id}
      storeSlug={store.slug}
      title={`${product.name} | ${store.name} | Macaport`}
    >
      <ProductStyles>
        <div className="wrapper">
          <div className="images">
            <div className="primary-img">
              <img src={primaryImage} alt={`${color} ${product.name}`} />
            </div>
            <div className="secondary-imgs">
              <div>
                <img src={product.image} alt={product.name} />
              </div>
              <div>
                <img src={product.image} alt={product.name} />
              </div>
              <div>
                <img src={product.image} alt={product.name} />
              </div>
            </div>
          </div>
          <div className="primary">
            <h2 className="name">{product.name}</h2>
            <h3 className="price">{formatToMoney(product.price)}</h3>
          </div>
          <div className="colors">
            <h4>Colors</h4>
            <div className="grid">
              {product.colors.map(c => (
                <Color
                  key={c.id}
                  hex={c.hex}
                  label={c.label}
                  color={color}
                  handleColorChange={handleColorChange}
                />
              ))}
            </div>
          </div>
          <div className="sizes">
            <h4>Sizes</h4>
            <div className="grid">
              {product.sizes.map(s => (
                <div key={s} className={`size ${size === s ? 'checked' : ''}`}>
                  <label htmlFor={s}>{s}</label>
                  <input
                    type="radio"
                    value={s}
                    onChange={handleSizeChange}
                    checked={size === s}
                    name={s}
                    id={s}
                    tabIndex={-1}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="actions">
            <button type="button" onClick={handleButtonClick}>
              Add to order
            </button>
            {validationError && <div className="error">{validationError}</div>}
          </div>
          <div className="details">
            <div className="description">
              <h4>Description</h4>
              <p>{product.description}</p>
            </div>
            <div className="other-details">
              <h4>Details</h4>
              <ul>
                <li>Cut, sewn, and dyed in Los Angeles, CA, USA</li>
                <li>Garment dyed</li>
                <li>Pre-washed &amp; pre shrunk</li>
                <li>50% Polyester, 37.5% Cotton, 12.5% Rayon</li>
              </ul>
            </div>
          </div>
        </div>
      </ProductStyles>
      <ProductSidebar
        item={product}
        color={color}
        size={size}
        isSidebarOpen={showSidebar}
        closeSidebar={handleCloseSidebar}
      />
    </StoreLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    console.log(context.query);
    const store = stores.find(s => s.slug === context.query.slug);

    if (!store) {
      throw new Error(`No store found at ${context.query.slug}`);
    }

    const product = store.products.find(p => p.id === context.query.productId);

    if (!product) {
      throw new Error(`Product with ID ${context.query.productId} not found.`);
    }

    const now = new Date();
    const storeIsActive = new Date(store.closeDate) > now;

    if (storeIsActive) {
      return {
        props: { store, product, active: true },
      };
    }

    return { props: { store: 'undefined', active: false } };
  } catch (err) {
    return {
      props: { error: err.message },
    };
  }
};
