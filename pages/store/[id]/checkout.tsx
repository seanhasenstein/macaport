import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { connectToDb, store as storeModel } from 'db';
import { getStoreStatus } from 'utils/store';
import { useCart } from '../../../hooks/useCart';
import { CartItem, Store } from '../../../interfaces';
import { getUrlParameter } from '../../../utils';
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

export default function Checkout({ store }: Props) {
  const { items, cartSubtotal, salesTax, cartTotal } = useCart();
  const [verifiedItems, setVerifiedItems] = React.useState<CartItem[]>([]);
  const [lowerInventoryItems, setLowerInventoryItems] = React.useState<
    CartItem[]
  >([]);
  const [outOfStockItems, setOutOfStockItems] = React.useState<CartItem[]>([]);
  const [showInventoryModal, setShowInventoryModal] = React.useState(false);

  return (
    <StoreLayout title={`Checkout | ${store.name}`}>
      <CheckoutStyles>
        <h2>Order Checkout</h2>
        <div className="wrapper">
          <CheckoutForm
            storeId={store._id}
            storeName={store.name}
            allowDirectShipping={store.allowDirectShipping}
            hasPrimaryShipping={store.hasPrimaryShippingLocation}
            primaryShippingAddress={store.primaryShippingLocation}
            requireGroupSelection={store.requireGroupSelection}
            groupTerm={store.groupTerm}
            groups={store.groups}
            setVerifiedItems={setVerifiedItems}
            setLowerInventoryItems={setLowerInventoryItems}
            setOutOfStockItems={setOutOfStockItems}
            setShowInventoryModal={setShowInventoryModal}
          />
          <CheckoutSidebar
            items={items}
            cartSubtotal={cartSubtotal}
            salesTax={salesTax}
            cartTotal={cartTotal}
          />
        </div>
        <OutOfStockModal
          verifiedItems={verifiedItems}
          lowerInventoryItems={lowerInventoryItems}
          outOfStockItems={outOfStockItems}
          showModal={showInventoryModal}
          setShowModal={setShowInventoryModal}
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
