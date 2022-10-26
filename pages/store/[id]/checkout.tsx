import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { connectToDb, store as storeModel } from 'db';
import { getStoreStatus } from 'utils/store';
import { useCart } from '../../../hooks/useCart';
import { Store } from '../../../interfaces';
import { getUrlParameter } from '../../../utils';
import useCheckoutSubmit from 'hooks/useCheckoutSubmit';
import StoreLayout from '../../../components/store/layouts/StoreLayout';
import CheckoutForm from '../../../components/store/checkout/CheckoutForm';
import OutOfStockModal from '../../../components/store/checkout/OutOfStockModal';
import CheckoutSidebar from 'components/store/checkout/CheckoutSidebar';

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
};

export default function Checkout(props: Props) {
  const cart = useCart();
  const checkout = useCheckoutSubmit({
    storeId: props.store._id,
    storeName: props.store.name,
    primaryShippingAddress: props.store.primaryShippingLocation,
  });

  return (
    <StoreLayout title={`Checkout | ${props.store.name}`}>
      <CheckoutStyles>
        <h2>Order Checkout</h2>
        <div className="wrapper">
          <CheckoutForm
            storeId={props.store._id}
            storeName={props.store.name}
            allowDirectShipping={props.store.allowDirectShipping}
            hasPrimaryShipping={props.store.hasPrimaryShippingLocation}
            primaryShippingAddress={props.store.primaryShippingLocation}
            requireGroupSelection={props.store.requireGroupSelection}
            groupTerm={props.store.groupTerm}
            groups={props.store.groups}
            checkout={checkout}
          />
          <CheckoutSidebar
            items={cart.items}
            cartSubtotal={cart.cartSubtotal}
            salesTax={cart.salesTax}
            cartTotal={cart.cartTotal}
          />
        </div>
        <OutOfStockModal
          verifiedItems={checkout.verifiedItems}
          lowerInventoryItems={checkout.lowerInventoryItems}
          outOfStockItems={checkout.outOfStockItems}
          showModal={checkout.showInventoryModal}
          setShowModal={checkout.setShowInventoryModal}
        />
      </CheckoutStyles>
    </StoreLayout>
  );
}

const CheckoutStyles = styled.div`
  padding: 0 1.5rem;

  h2 {
    margin: 4rem auto 0;
    max-width: 72rem;
    font-size: 1.625rem;
  }

  .wrapper {
    margin: 0 auto;
    max-width: 72rem;
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 32rem) 32rem;
    grid-template-rows: auto auto;
    justify-content: space-between;
    gap: 0 3rem;
  }

  @media (max-width: 1024px) {
    h2 {
      margin: 3rem 0;
      font-size: 1.5rem;
      text-align: center;
    }

    .wrapper {
      max-width: 40rem;
      display: flex;
      flex-direction: column-reverse;
    }
  }
`;
