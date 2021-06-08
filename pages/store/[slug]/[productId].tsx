import React from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useCart } from '../../../hooks/useCart';
import { Store, Item, Size } from '../../../interfaces';
import { formatToMoney } from '../../../utils';
import StoreLayout from '../../../components/store/StoreLayout';
import ProductSidebar from '../../../components/store/ProductSidebar';
import Lightbox from '../../../components/store/Lightbox';
import { MessageStyles } from '../../../styles/Message';
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
  padding: 2.5rem 1.5rem;

  .wrapper {
    margin: 0 auto;
    max-width: 75rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 0.8fr;
    gap: 0 3rem;
  }

  .images {
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
      cursor: pointer;

      img {
        max-width: 24rem;
        width: 100%;
      }
    }

    .secondary-imgs {
      margin: 1.5rem 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
      gap: 1.5rem;
      width: 100%;

      button {
        padding: 2rem;
        background-color: #fff;
        border: 1px solid #e5e7eb;
        box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
        cursor: pointer;

        img {
          width: 100%;
        }
      }
    }
  }

  .mobile-header {
    display: none;
  }

  .large-header {
    margin: 0 0 3rem;
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

  .main h4 {
    margin: 0 0 1rem;
    font-weight: 500;
    font-size: 1rem;
    color: #111827;
  }

  .sizes,
  .actions,
  .description,
  .details {
    margin: 2rem 0 0;
  }

  .colors {
    .grid {
      max-width: 18rem;
      width: 100%;
      display: flex;
      list-style-type: none;
    }
  }

  .sizes {
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
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

      &.checked,
      &.checked:hover {
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

  .add-to-order-button {
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
    padding: 2.5rem 1.5rem;

    .wrapper {
      grid-template-columns: 1fr;
    }

    .mobile-header {
      margin: 0 0 2rem;
      display: flex;
      justify-content: space-between;
    }

    .large-header {
      display: none;
    }

    .name {
      font-size: 1.125rem;
    }
  }
`;

export default function Product({ store, product, error }: Props) {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showLightbox, setShowLightbox] = React.useState(false);
  const [color, setColor] = React.useState(() => {
    if (error) return 'error';
    if (router.query.color) {
      const color = Array.isArray(router.query.color)
        ? router.query.color[0]
        : router.query.color;

      const verifiedColor = product.colors.find(c => c.label === color);

      return verifiedColor ? verifiedColor.label : product.colors[0].label;
    } else {
      return product.colors[0].label;
    }
  });
  const [primaryImage, setPrimaryImage] = React.useState(() => {
    if (error) return 'error';
    const c = product.colors.find(c => c.label === color);
    return c?.primaryImage;
  });
  const [secondaryImages, setSecondaryImages] = React.useState(() => {
    if (error) return [{ id: 1, url: 'error', alt: 'error' }];
    const c = product.colors.find(c => c.label === color);
    return c?.secondaryImages;
  });
  const [clickedImage, setClickedImage] = React.useState('image-0');
  const [size, setSize] = React.useState<Size>({
    id: 9999,
    label: 'DEFAULT',
    price: 0,
  });
  const [validationError, setValidationError] = React.useState<string>();
  const { addItem } = useCart();

  React.useEffect(() => {
    if (error) return;

    router.push(
      `/store/${store.slug}/${product.id}?color=${color}`,
      undefined,
      { shallow: true }
    );

    setPrimaryImage(() => {
      const c = product.colors.find(c => c.label === color);
      return c?.primaryImage;
    });

    setSecondaryImages(() => {
      const c = product.colors.find(c => c.label === color);
      return c?.secondaryImages;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationError && e.target.value !== undefined)
      setValidationError(undefined);
    const s = product.sizes.find(s => s.label === e.target.value);

    if (!s) {
      // todo: look at this error and figure out if its the best way to alert user
      // should I setSize(undefined)?
      throw new Error('No size was found!');
    }

    setSize(s);
  };

  const handleImageClick = (imageIndex: string) => {
    setClickedImage(imageIndex);
    setShowLightbox(true);
  };

  const handleAddToOrderClick = () => {
    if (size.label === 'DEFAULT') {
      setValidationError('Please select a size');
      return;
    }

    const sku = product.skus.find(
      sku => sku.size.label === size.label && sku.color.label === color
    );

    // todo: figure out what to do when no sku or item is found
    if (sku)
      addItem({
        ...product,
        id: sku.id,
        productId: product.id,
        image: primaryImage,
        color,
        size: sku.size,
      });
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  if (error) {
    return (
      <StoreLayout>
        <MessageStyles>
          <div className="wrapper">
            <div className="content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3>Error</h3>
              <p>{error}</p>
              <Link href={`/store/${router.query.slug}`}>
                <a className="button">Back to store home</a>
              </Link>
            </div>
          </div>
        </MessageStyles>
      </StoreLayout>
    );
  }

  return (
    <>
      <StoreLayout
        storeId={store.id}
        storeSlug={store.slug}
        title={`${product.name} | ${store.name} | Macaport`}
      >
        <ProductStyles>
          <div className="wrapper">
            <div className="mobile-header">
              <h2 className="name">{product.name}</h2>
              <h3 className="price">
                {formatToMoney(
                  size.label !== 'DEFAULT' ? size.price : product.sizes[0].price
                )}
              </h3>
            </div>
            <div className="images">
              <button
                className="primary-img"
                onClick={() => handleImageClick('image-0')}
              >
                <img src={primaryImage} alt={`${color} ${product.name}`} />
              </button>
              <div className="secondary-imgs">
                {secondaryImages &&
                  secondaryImages.map((image, i) => (
                    <button
                      key={image.id}
                      onClick={() => handleImageClick(`image-${i + 1}`)}
                    >
                      <img src={image.url} alt={image.alt} />
                    </button>
                  ))}
              </div>
            </div>
            <div className="main">
              <div className="large-header">
                <h2 className="name">{product.name}</h2>
                <h3 className="price">
                  {formatToMoney(
                    size.label !== 'DEFAULT'
                      ? size.price
                      : product.sizes[0].price
                  )}
                </h3>
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
                    <div
                      key={s.id}
                      className={`size ${
                        size && size.label === s.label ? 'checked' : ''
                      }`}
                    >
                      <label htmlFor={s.label}>{s.label}</label>
                      <input
                        type="radio"
                        value={s.label}
                        checked={size && size.label === s.label}
                        onChange={handleSizeChange}
                        name={s.label}
                        id={s.label}
                        tabIndex={-1}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="actions">
                <button
                  type="button"
                  className="add-to-order-button"
                  onClick={handleAddToOrderClick}
                >
                  Add to order
                </button>
                {validationError && (
                  <div className="error">{validationError}</div>
                )}
              </div>
              <div className="details">
                {product.description && (
                  <div className="description">
                    <h4>Description</h4>
                    <p>{product.description}</p>
                  </div>
                )}
                {product.details && (
                  <div className="other-details">
                    <h4>Details</h4>
                    <ul>
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ProductStyles>
        <ProductSidebar
          item={product}
          color={color}
          size={size}
          image={primaryImage}
          isSidebarOpen={showSidebar}
          closeSidebar={handleCloseSidebar}
        />
      </StoreLayout>
      {showLightbox && primaryImage ? (
        <Lightbox
          setShowLightbox={setShowLightbox}
          primaryImage={primaryImage}
          primaryAlt={`${color} ${product.name}`}
          secondaryImages={secondaryImages}
          clickedImage={clickedImage}
        />
      ) : null}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const store = stores.find(s => s.slug === context.query.slug);

    if (!store) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-not-found',
        },
      };
    }

    const now = new Date();
    const storeIsActive =
      store.closeDate === null ? true : new Date(store.closeDate) > now;

    if (!storeIsActive) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-closed',
        },
      };
    }

    const product = store.products.find(p => p.id === context.query.productId);

    if (!product) {
      throw new Error('Product not found.');
    }

    return { props: { store, product } };
  } catch (err) {
    return {
      props: { error: err.message },
    };
  }
};