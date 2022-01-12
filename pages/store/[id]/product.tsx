import React from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { connectToDb, store } from '../../../db';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useCart } from '../../../hooks/useCart';
import {
  Store,
  StoreProduct,
  ProductColor,
  ProductSize,
} from '../../../interfaces';
import {
  formatToMoney,
  getUrlParameter,
  isOutOfStock,
  isStoreActive,
  slugify,
} from '../../../utils';
import StoreLayout from '../../../components/store/StoreLayout';
import CustomOptions from '../../../components/store/product/CustomOptions';
import ProductSidebar from '../../../components/store/ProductSidebar';
import Lightbox from '../../../components/store/Lightbox';
import { MessageStyles } from '../../../styles/Message';

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = getUrlParameter(context.query.id);

    if (!id) {
      throw new Error('No store id provided.');
    }

    const { db } = await connectToDb();
    const storeRes: Store = await store.getStoreById(db, id);

    if (!storeRes) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-not-found',
        },
      };
    }

    const storeIsActive = isStoreActive(storeRes.openDate, storeRes.closeDate);

    if (!storeIsActive) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-closed',
        },
      };
    }

    const product = storeRes.products.find(
      p => p.id === context.query.productId
    );

    if (!product) {
      throw new Error('Product not found.');
    }

    return { props: { store: storeRes, product } };
  } catch (error) {
    return {
      props: { error },
    };
  }
};

type Props = {
  store: Store;
  product: StoreProduct;
  active: boolean;
  error: string;
};

const defaultSize = {
  id: 9999,
  label: 'DEFAULT',
  price: 0,
};

export default function Product({ store, product, error }: Props) {
  const router = useRouter();
  const { addItem, items } = useCart();
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showLightbox, setShowLightbox] = React.useState(false);
  const [color, setColor] = React.useState(() => {
    if (router.query.colorId) {
      const colorId = getUrlParameter(router.query.colorId);
      const verifiedColor = product.colors.find(c => c.id === colorId);
      return verifiedColor || product.colors[0];
    } else {
      return product.colors[0];
    }
  });
  const [primaryImage, setPrimaryImage] = React.useState(() => {
    if (error) return 'error';
    const c = product.colors.find(c => c.id === color.id);
    return c?.primaryImage;
  });
  const [secondaryImages, setSecondaryImages] = React.useState(() => {
    if (error) return ['error'];
    const c = product.colors.find(c => c.id === color.id);
    return c?.secondaryImages;
  });
  const [clickedImage, setClickedImage] = React.useState('image-0');
  const [size, setSize] = React.useState<ProductSize>(defaultSize);
  const [validationError, setValidationError] = React.useState<string>();
  const [showName, setShowName] = React.useState(false);
  const [showNumber, setShowNumber] = React.useState(false);
  const [name, setName] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [nameError, setNameError] = React.useState<string>();
  const [numberError, setNumberError] = React.useState<string>();

  React.useEffect(() => {
    if (!showName) {
      setName('');
    }
    if (!showNumber) {
      setNumber('');
    }
  }, [showNumber, showName]);

  React.useEffect(() => {
    if (error) return;

    router.push(
      `/store/${store._id}/product?productId=${product.id}&colorId=${color.id}`,
      undefined,
      { shallow: true }
    );

    setPrimaryImage(() => {
      const c = product.colors.find(c => c.id === color.id);
      return c?.primaryImage;
    });

    setSecondaryImages(() => {
      const c = product.colors.find(c => c.id === color.id);
      return c?.secondaryImages;
    });

    setSize(defaultSize);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedColor =
      product.colors.find(c => c.id === e.target.value) || product.colors[0];
    setColor(updatedColor);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationError && e.target.value !== undefined)
      setValidationError(undefined);
    const s = product.sizes.find(s => s.label === e.target.value);

    if (!s) {
      // todo: look at this error and figure out if its the best way to alert user
      // setSize(undefined)?
      throw new Error('No size was found!');
    }

    setSize(s);
  };

  const handleImageClick = (imageIndex: string) => {
    setClickedImage(imageIndex);
    setShowLightbox(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (nameError) {
      setNameError(undefined);
    }
    setName(e.target.value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberCoercion = Number(e.target.value);
    if (isNaN(numberCoercion) === true) {
      return;
    }
    if (numberError) {
      setNumberError(undefined);
    }
    setNumber(e.target.value.trim());
  };

  const handleProductReset = () => {
    setShowName(false);
    setShowNumber(false);
    setShowSidebar(false);
    setSize(defaultSize);
  };

  const handleAddToOrderClick = () => {
    if (
      size.label === 'DEFAULT' ||
      (showName && name.trim() === '') ||
      (showNumber && number.trim() === '')
    ) {
      if (size.label === 'DEFAULT') {
        setValidationError('A size is required.');
      }
      if (showName && name === '') {
        setNameError('Name is required if turned on.');
      }
      if (showNumber && number === '') {
        setNumberError('Number is required if turned on.');
      }
      return;
    }

    const sku = product.productSkus.find(
      sku => sku.size.label === size.label && sku.color.id === color.id
    );

    if (sku)
      addItem({
        id: `${sku.id}${showName ? `-${slugify(name)}` : ''}${
          showNumber ? `-${slugify(number)}` : ''
        }`,
        sku: sku,
        quantity: 1,
        name: product.name,
        image: primaryImage,
        price: sku.size.price,
        customName: name.trim(),
        customNumber: number.trim(),
      });

    setShowSidebar(true);
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
              <Link href={`/store/${store._id}`}>
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
      <StoreLayout title={`${product.name} | ${store.name} | Macaport`}>
        <ProductStyles>
          <div className="wrapper">
            <div className="mobile-header">
              <h2 className="name">{product.name}</h2>
              <h3 className="price">
                {formatToMoney(
                  size.label !== 'DEFAULT'
                    ? size.price + (showName ? 500 : 0) + (showNumber ? 500 : 0)
                    : product.sizes[0].price +
                        (showName ? 500 : 0) +
                        (showNumber ? 500 : 0)
                )}
              </h3>
            </div>
            <div className="images">
              <button
                className="primary-img"
                onClick={() => handleImageClick('image-0')}
              >
                <img
                  src={primaryImage}
                  alt={`${color.label} ${product.name}`}
                />
              </button>
              <div className="secondary-imgs">
                {secondaryImages &&
                  secondaryImages.map((secImg, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(`image-${index + 1}`)}
                    >
                      <img
                        src={secImg}
                        alt={`${color.label} ${product.name} ${index + 2}`}
                      />
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
                      ? size.price +
                          (showName ? 500 : 0) +
                          (showNumber ? 500 : 0)
                      : product.sizes[0].price +
                          (showName ? 500 : 0) +
                          (showNumber ? 500 : 0)
                  )}
                </h3>
              </div>
              <div className="colors">
                <h4>Colors</h4>
                <div className="grid">
                  {product.colors.map(c => (
                    <Color
                      key={c.id}
                      id={c.id}
                      hex={c.hex}
                      label={c.label}
                      activeColor={color}
                      handleColorChange={handleColorChange}
                    />
                  ))}
                </div>
              </div>
              <div className="section sizes">
                <h4>Sizes</h4>
                <div className="grid">
                  {product.productSkus.map(sku => {
                    if (sku.color.id === color.id) {
                      return (
                        <div
                          key={sku.size.id}
                          className={`size ${
                            size.label === sku.size.label ? 'checked' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            value={sku.size.label}
                            checked={size.label === sku.size.label}
                            disabled={isOutOfStock(sku, items)}
                            onChange={handleSizeChange}
                            name="size"
                            id={sku.size.label}
                          />
                          <label
                            htmlFor={sku.size.label}
                            className={
                              isOutOfStock(sku, items) ? 'out-of-stock' : ''
                            }
                          >
                            {sku.size.label}
                          </label>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              <CustomOptions
                className="section"
                includeCustomName={product.includeCustomName}
                includeCustomNumber={product.includeCustomNumber}
                showName={showName}
                setShowName={setShowName}
                showNumber={showNumber}
                setShowNumber={setShowNumber}
                name={name}
                setName={handleNameChange}
                number={number}
                setNumber={handleNumberChange}
                nameError={nameError}
                numberError={numberError}
              />

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
              <div className="section details">
                {product.description && (
                  <div className="section description">
                    <h4>Description</h4>
                    <p>{product.description}</p>
                  </div>
                )}
                {product.details && product.details.length > 0 && (
                  <div className="other-details">
                    <h4>Details</h4>
                    <ul>
                      {product?.details.map((d, i) => (
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
          storeId={store._id}
          item={product}
          color={color}
          size={size}
          image={primaryImage}
          resetProduct={handleProductReset}
          customName={name}
          customNumber={number}
          isSidebarOpen={showSidebar}
        />
      </StoreLayout>
      {showLightbox && primaryImage ? (
        <Lightbox
          setShowLightbox={setShowLightbox}
          primaryImage={primaryImage}
          primaryAlt={`${color.label} ${product.name}`}
          secondaryImages={secondaryImages}
          clickedImage={clickedImage}
        />
      ) : null}
    </>
  );
}

type ColorProps = {
  id: string;
  label: string;
  hex: string;
  activeColor: ProductColor;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Color = (props: ColorProps) => (
  <ColorStyles {...props} title={props.label}>
    <input
      type="radio"
      name="color"
      id={props.hex}
      value={props.id}
      onChange={props.handleColorChange}
      checked={props.id === props.activeColor.id}
    />
    <div
      className={`label-wrapper ${
        props.id === props.activeColor.id ? 'checked' : ''
      }`}
    >
      <label htmlFor={props.hex}>
        <span className="sr-only">{props.label}</span>
      </label>
    </div>
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
      border-radius: 0.1875rem;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      cursor: pointer;

      &:focus {
        outline-color: rgb(99, 102, 241);
      }

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
        border-radius: 0.1875rem;
        box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
        cursor: pointer;

        &:focus {
          outline-color: rgb(99, 102, 241);
        }

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

  .section {
    margin: 2.5rem 0 0;
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

      label {
        position: relative;
        margin: 0;
        padding: 0.625rem 1rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #d1d5db;
        border-radius: 0.25rem;
        font-size: 0.9375rem;
        letter-spacing: 0.0375em;
        color: #111827;
        cursor: pointer;
        text-align: center;

        &.out-of-stock {
          color: #c7cbd2;
          cursor: default;
        }

        &:hover:not(.out-of-stock) {
          border-color: #9ca3af;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1),
            0 1px 2px -1px rgb(0 0 0 / 0.1);
        }
      }

      &.checked label,
      &.checked label:hover {
        background-color: #282d34;
        border-color: #282d34;
        color: #fff;
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

        &:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }

        &:focus-visible + label {
          box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px,
            rgb(99, 102, 241) 0px 0px 0px 4px,
            rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
        }
      }
    }
  }

  .add-to-order-button {
    margin: 2rem 0 0;
    padding: 0.75rem 1.25rem;
    width: 100%;
    height: 2.625rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #282d34;
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
      background-color: #202329;
      color: rgba(255, 255, 255, 1);
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #4f46e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
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
    color: #b91c1c;
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
      font-weight: 600;
    }

    .images {
      margin: 0 0 2rem;
      display: flex;
      flex-direction: row;
      align-items: unset;
      gap: 1rem;

      .primary-img {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .secondary-imgs {
        margin: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        width: 7rem;

        button {
          padding: 0.5rem;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
`;

const ColorStyles = styled.div`
  margin: 0 0.875rem 0 0;
  position: relative;
  height: 2.5rem;
  width: 2.5rem;

  .label-wrapper {
    height: 2.5rem;
    width: 2.5rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.15) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
    border-radius: 9999px;

    &.checked {
      padding: 0.125rem;
      border: 2px solid #374151;
    }

    label {
      display: flex;
      height: 100%;
      width: 100%;
      border-radius: 9999px;
      background-color: ${(props: ColorProps) => props.hex};
      cursor: pointer;
    }
  }

  input[type='radio'] {
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
    z-index: -1;

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: none;
    }

    &:focus-visible + .label-wrapper {
      border-color: rgb(99, 102, 241);
    }

    &:checked {
      background-image: none;
      color: transparent;
    }
  }
`;
