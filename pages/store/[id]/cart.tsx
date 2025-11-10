import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { connectToDb, store as storeModel } from 'db';

import { getStoreStatus } from 'utils/store';
import { formatToMoney, getUrlParameter } from '../../../utils';
import useHasMounted from '../../../hooks/useHasMounted';
import { useCart } from '../../../hooks/useCart';
import { useTeacherAppreciation } from 'hooks/useTeacherAppreciation';
import { useSheboyganLutheranStaff } from 'hooks/useSheboyganLutheranStaff';
import { useSwitchFitnessDiscount } from 'hooks/useSwitchFitness';

import StoreLayout from '../../../components/store/layouts/StoreLayout';
import CartItem from '../../../components/store/cart/CartItem';
import LinkButton from '../../../components/store/common/LinkButton';

import { CartItem as CartItemInterface, Store } from '../../../interfaces';

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

export default function Cart(props: Props) {
  const hasMounted = useHasMounted();
  const router = useRouter();

  const { store } = props;
  const {
    _id: storeId,
    meta,
    name: storeName,
    products,
    teacherAppreciationId,
  } = store;

  const {
    isEligible: isEligibleForSwitchFitnessDiscount,
    alreadyUsed: alreadyUsedForSwitchFitnessDiscount,
  } = useSwitchFitnessDiscount();

  const isSwitchFitnessStore =
    !!meta?.isSwitchFitness && !!meta?.switchFitnessDiscountId;
  const applySwitchFitnessDiscount =
    isSwitchFitnessStore &&
    isEligibleForSwitchFitnessDiscount &&
    !alreadyUsedForSwitchFitnessDiscount;

  const {
    alreadyUsed: alreadyUsedForSheboyganLutheranStaff,
    isEligible: isEligibleForSheboyganLutheranStaff,
  } = useSheboyganLutheranStaff();

  const isSheboyganLutheranStaffStore = !!store.sheboyganLutheranStaffId;
  const applySheboyganLutheranStaffDiscount =
    isSheboyganLutheranStaffStore &&
    isEligibleForSheboyganLutheranStaff &&
    !alreadyUsedForSheboyganLutheranStaff;

  const cart = useCart({
    sheboyganLutheranStaffEligible:
      isEligibleForSheboyganLutheranStaff &&
      !alreadyUsedForSheboyganLutheranStaff,
  });

  const {
    email: teacherAppreciationEmail,
    isEligible: isEligibleForTeacherAppreciation,
    alreadyUsed: alreadyUsedForTeacherAppreciation,
  } = useTeacherAppreciation();

  const isTeacherAppreciationStore = !!teacherAppreciationId;
  const cartHasFreeItem = cart.items.some(
    item => item.itemTotal === 0 && item.quantity === 1
  );
  const eligibleForTeacherAppreciation =
    isTeacherAppreciationStore &&
    isEligibleForTeacherAppreciation &&
    !alreadyUsedForTeacherAppreciation;

  // if (props.error) {
  // TODO: add error component
  // }

  // TODO: add this check in getServerSideProps
  if (hasMounted && (!products || products.length < 1)) {
    router.push(`/store/${router.query.id}`);
    return <div />;
  }

  return (
    <StoreLayout title={`Cart | ${storeName}`}>
      <CartStyles>
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
                      <Link href={`/store/${storeId}`}>
                        <a>Continue Shopping</a>
                      </Link>
                      .
                    </div>
                  ) : (
                    cart.items.map((item: CartItemInterface) => {
                      const product = products.find(
                        p => p.id === item.sku.storeProductId
                      );

                      if (!product) {
                        cart.removeItem(item.sku.id);
                        return;
                      }

                      return (
                        <CartItem
                          key={item.id}
                          {...{
                            storeId,
                            item,
                            skus: product.productSkus,
                            sizes: product.sizes,
                            cartHasFreeItem,
                            isTeacherAppreciationStore,
                            teacherAppreciationEmail,
                            eligibleForTeacherAppreciation,
                            isDemo: false,
                          }}
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
                    {applySwitchFitnessDiscount && cart.cartSubtotal > 0 ? (
                      <div className="item">
                        <div className="key">Switch Fitness Promo</div>
                        <div className="value">-$25.00</div>
                      </div>
                    ) : null}
                    {applySheboyganLutheranStaffDiscount &&
                    cart.cartSubtotal > 0 ? (
                      <div className="item">
                        <div className="key">Sheboygan Lutheran Staff</div>
                        {/* TODO: add dyanmic value from database */}
                        <div className="value">-$75.00</div>
                      </div>
                    ) : null}
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
                      href={`/store/${storeId}/checkout`}
                      label="Checkout"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </CartStyles>
    </StoreLayout>
  );
}

const CartStyles = styled.div`
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
