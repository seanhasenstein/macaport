import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { connectToDb, store as storeModel } from 'db';
import { useCart } from '../../../../hooks/useCart';
import useHasMounted from '../../../../hooks/useHasMounted';
import { CartItem as CartItemInterface, Store } from '../../../../interfaces';
import { formatToMoney, getUrlParameter } from '../../../../utils';
import StoreLayout from '../../../../components/store/layouts/StoreLayout';
import CartItem from '../../../../components/store/cart/CartItem';
import LinkButton from '../../../../components/store/common/LinkButton';
import DemoBanner from 'components/store/demo/banner';

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

    return { props: { store } };
  } catch (error) {
    return {
      props: { error },
    };
  }
};

type Props = {
  store: Store;
  error?: string;
};

export default function DemoCart(props: Props) {
  const router = useRouter();
  const hasMounted = useHasMounted();
  const cart = useCart();

  // if (props.error) {
  // TODO: add error component
  // }

  // TODO: add this check in getServerSideProps
  if (
    hasMounted &&
    (!props.store.products || props.store.products.length < 1)
  ) {
    router.push(`/store/${router.query.id}/demo`);
    return <div />;
  }

  return (
    <StoreLayout title={`Cart | ${props.store.name}`}>
      <DemoCartStyles>
        <div className="wrapper">
          <h2>Your Cart</h2>
          {hasMounted ? (
            <>
              <div className="order-details">
                ({cart.totalItems} Item
                {cart.totalItems > 1 ? 's' : cart.totalItems === 0 ? 's' : null}
                )
              </div>
              <div className="grid">
                <div className="items">
                  {cart.cartIsEmpty ? (
                    <div className="empty-cart">
                      Your cart is empty.{' '}
                      <Link
                        href={`/store/${props.store._id}${
                          router.pathname.split('/').includes('demo')
                            ? '/demo'
                            : ''
                        }`}
                      >
                        <a>Continue Shopping</a>
                      </Link>
                      .
                    </div>
                  ) : (
                    cart.items.map((item: CartItemInterface) => {
                      const product = props.store.products.find(
                        p => p.id === item.sku.storeProductId
                      );

                      if (!product) {
                        cart.removeItem(item.sku.id);
                        return;
                      }

                      return (
                        <CartItem
                          key={item.id}
                          item={item}
                          storeId={props.store._id}
                          skus={product.productSkus}
                          sizes={product.sizes}
                          isDemo={router.pathname.split('/').includes('demo')}
                        />
                      );
                    })
                  )}
                </div>
                <div>
                  <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="item">
                      <div className="key">Subtotal</div>
                      <div className="value">
                        {formatToMoney(cart.cartSubtotal, true)}
                      </div>
                    </div>
                    <div className="item">
                      <div className="key">Sales Tax</div>
                      <div className="value">
                        {formatToMoney(cart.salesTax, true)}
                      </div>
                    </div>
                    <div className="item">
                      <div className="key">Shipping</div>
                      <div className="value">Calculated next</div>
                    </div>
                    <div className="item total">
                      <div className="key">Order Total</div>
                      <div className="value">
                        {formatToMoney(cart.cartTotalWithoutShipping, true)}
                      </div>
                    </div>
                    <LinkButton
                      href={`/store/${props.store._id}/${
                        router.pathname.split('/').includes('demo')
                          ? 'demo/'
                          : ''
                      }checkout`}
                      label="Checkout"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </DemoCartStyles>
      <DemoBanner />
    </StoreLayout>
  );
}

const DemoCartStyles = styled.div`
  padding: 0 1.5rem;

  .wrapper {
    margin: 4rem auto;
    max-width: 72rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 1.75rem;
    font-size: 1.5rem;
  }

  .order-details {
    margin: 0.5rem 0 1.5rem;
    font-size: 1rem;
    color: #6e788c;
    display: none;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr minmax(23rem, 25rem);
    gap: 0 5rem;
  }

  .items {
    max-width: 40rem;
    width: 100%;
  }

  .order-summary {
    padding: 1.875rem 2.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    h3 {
      margin: 0 0 1rem;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .item {
      padding: 1.125rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;

      &:last-of-type {
        border: none;
      }

      .key,
      .value {
        font-size: 0.9375rem;
        font-weight: 500;
      }

      .key {
        color: #6b7280;
      }

      .value {
        color: #111827;
      }

      &.total {
        margin: 0 0 0.5rem;

        .key,
        .value {
          color: #374151;
          font-size: 1rem;
          font-weight: 600;
        }

        .value {
          color: #059669;
        }
      }
    }
  }

  .empty-cart {
    padding: 1rem 0;
    color: #374151;

    a {
      display: inline-flex;
      align-items: center;
      color: #303eb1;
      text-decoration: underline;

      &:hover {
        color: #1629cb;
      }
    }
  }

  @media (max-width: 1024px) {
    h2 {
      margin: 0;
      text-align: center;
    }

    .order-details {
      display: block;
      text-align: center;
    }

    .grid {
      margin: 0 auto;
      max-width: 700px;
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
    }

    .items {
      max-width: unset;
      width: 100%;
    }

    .order-summary {
      margin: 3rem 0 0;
      max-width: 100%;
    }

    .empty-cart {
      text-align: center;
    }
  }
`;
