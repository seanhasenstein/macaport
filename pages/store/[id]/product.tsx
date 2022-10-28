import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { connectToDb, store as storeModel } from 'db';
import { defaultSize, getStoreStatus } from 'utils/store';
import { Store, StoreProduct } from '../../../interfaces';
import { getUrlParameter } from '../../../utils';
import { useCart } from '../../../hooks/useCart';
import useHasMounted from '../../../hooks/useHasMounted';
import useProductColor from 'hooks/useStoreProductColor';
import useProductImages from 'hooks/useStoreProductImages';
import useProductSize from 'hooks/useStoreProductSize';
import useStoreProductPersonalization from '../../../hooks/useStoreProductPersonalization';
import useAddProductToOrder from 'hooks/useStoreProductAddToOrder';
import StoreLayout from '../../../components/store/layouts/StoreLayout';
import ProductPersonalization from '../../../components/store/product/personalization';
import ProductPageError from 'components/store/errors/ProductPageError';
import SmallHeader from 'components/store/product/SmallHeader';
import LargeHeader from 'components/store/product/LargeHeader';
import ProductImages from 'components/store/product/ProductImages';
import ProductColors from 'components/store/product/ProductColors';
import ProductSizes from 'components/store/product/ProductSizes';
import ProductActions from 'components/store/product/ProductActions';
import ProductDescription from 'components/store/product/ProductDescription';
import ProductDetails from 'components/store/product/ProductDetails';
import Sidebar from '../../../components/store/product/Sidebar';
import Lightbox from '../../../components/store/product/Lightbox';

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = getUrlParameter(context.query.id);

    if (!id) {
      throw new Error("A store id is required but wasn't provided");
    }

    const db = await connectToDb();
    const store = await storeModel.getStoreById(db, id);

    if (!store) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-not-found',
        },
      };
    }

    const isStoreActive = getStoreStatus(store.openDate, store.closeDate);

    if (isStoreActive === false) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-closed',
        },
      };
    }

    const product = store.products.find(p => p.id === context.query.productId);

    if (!product) {
      return {
        redirect: {
          permanent: false,
          destination: `/store/${store._id}`,
        },
      };
    }

    return { props: { store, product } };
  } catch (error) {
    return {
      props: { error },
    };
  }
};

type Props = {
  store: Store;
  product: StoreProduct;
  error?: string;
};

export default function Product(props: Props) {
  const hasMounted = useHasMounted();
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showLightbox, setShowLightbox] = React.useState(false);

  const { addItem, items } = useCart();

  const productPersonalization = useStoreProductPersonalization(
    props.product.personalization.addons,
    props.product.personalization.maxLines
  );

  const productColor = useProductColor({
    productColors: props.product.colors,
    productSkus: props.product.productSkus,
    cartItems: items,
    showSidebar,
  });

  const productSize = useProductSize({
    cartItems: items,
    productSkus: props.product.productSkus,
    selectedColor: productColor.color,
  });

  const productImages = useProductImages({
    error: props.error,
    productColors: props.product.colors,
    selectedColor: productColor.color,
    storeId: props.store._id,
    productId: props.product.id,
    setSize: productSize.setSize,
    setShowLightbox,
  });

  const handleAddToOrder = useAddProductToOrder({
    addItem,
    productName: props.product.name,
    primaryImage: productImages.primaryImage,
    size: productSize.size,
    color: productColor.color,
    productSkus: props.product.productSkus,
    personalization: productPersonalization,
    setShowSidebar,
    setSizeValidationError: productSize.setSizeValidationError,
  });

  const handleProductReset = () => {
    productPersonalization.reset();
    setShowSidebar(false);
    productSize.setSize(defaultSize);
    productSize.setLowInventory(false);
  };

  if (props.error) {
    return <ProductPageError error={props.error} storeId={props.store._id} />;
  }

  return (
    <>
      <StoreLayout title={`${props.product.name} | ${props.store.name}`}>
        <ProductStyles>
          <div className="wrapper">
            <SmallHeader
              productName={props.product.name}
              productSizes={props.product.sizes}
              size={productSize.size}
              personalizationTotal={productPersonalization.total}
            />

            <ProductImages
              productName={props.product.name}
              color={productColor.color}
              {...productImages}
            />

            <div className="main-content">
              <LargeHeader
                productName={props.product.name}
                productSizes={props.product.sizes}
                size={productSize.size}
                personalizationTotal={productPersonalization.total}
              />

              <ProductColors
                productColors={props.product.colors}
                color={productColor.color}
                handleColorChange={productColor.handleColorChange}
              />

              <div className="section">
                <ProductSizes
                  cartItems={items}
                  productSkus={props.product.productSkus}
                  color={productColor.color}
                  size={productSize.size}
                  colorOutOfStock={productColor.colorOutOfStock}
                  lowInventory={productSize.lowInventory}
                  handleSizeChange={productSize.handleSizeChange}
                  hasMounted={hasMounted}
                />
              </div>

              <ProductPersonalization
                {...props.product.personalization}
                {...productPersonalization}
              />

              <ProductActions
                handleAddToOrder={handleAddToOrder}
                sizeValidationError={productSize.sizeValidationError}
                personalizationValidationError={
                  productPersonalization.validationError
                }
              />

              <div className="section">
                <ProductDescription description={props.product.description} />
              </div>

              <ProductDetails details={props.product.details} />
            </div>
          </div>
        </ProductStyles>
        <Sidebar
          storeId={props.store._id}
          item={props.product}
          color={productColor.color}
          size={productSize.size}
          image={productImages.primaryImage}
          resetProduct={handleProductReset}
          personalization={{
            addonItems: productPersonalization.flattenedItems,
            total: productPersonalization.total,
          }}
          isOpen={showSidebar}
        />
      </StoreLayout>
      {showLightbox && productImages.primaryImage ? (
        <Lightbox
          setShowLightbox={setShowLightbox}
          primaryImage={productImages.primaryImage}
          primaryAlt={`${productColor.color.label} ${props.product.name}`}
          secondaryImages={productImages.secondaryImages}
          clickedImage={productImages.clickedImage}
        />
      ) : null}
    </>
  );
}

const ProductStyles = styled.div`
  padding: 2.5rem 1.5rem;

  .wrapper {
    margin: 0 auto;
    max-width: 72rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 0.8fr;
    gap: 0 3.5rem;
  }

  .section {
    margin: 2.5rem 0 0;
  }

  @media (max-width: 1024px) {
    .wrapper {
      grid-template-columns: 1fr 1fr;
      gap: 0 2rem;
    }
  }

  @media (max-width: 767px) {
    padding: 2.5rem 1.5rem;

    .wrapper {
      grid-template-columns: 1fr;
    }
  }
`;
