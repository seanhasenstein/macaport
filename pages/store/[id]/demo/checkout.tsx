import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';

import { connectToDb, shipping, store } from 'db';

import { getUrlParameter } from '../../../../utils';
import useCheckoutSubmit from 'hooks/useCheckoutSubmit';
import { usePricedCart } from 'hooks/usePricedCart';
import { getBenefitView } from 'utils/memberBenefit';
import { membersOnlyLockout } from 'utils/benefitDisplay';

import StoreLayout from '../../../../components/store/layouts/StoreLayout';
import CheckoutForm from '../../../../components/store/checkout/CheckoutForm';
import OutOfStockModal from '../../../../components/store/checkout/OutOfStockModal';
import CheckoutSidebar from 'components/store/checkout/CheckoutSidebar';
import DemoBanner from 'components/store/demo/banner';

import { BenefitView, ShippingData, Store } from '../../../../interfaces';

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = getUrlParameter(context.query.id);

    if (!id) {
      throw new Error("A store id is required but wasn't provided");
    }

    const db = await connectToDb();
    const storeResult = await store.getStoreById(db, id);
    const shippingResult = await shipping.getShippingDetails(db);

    if (!storeResult) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-not-found',
        },
      };
    }

    const benefit = await getBenefitView(db, storeResult, context.req);

    if (membersOnlyLockout(benefit)) {
      return {
        redirect: {
          permanent: false,
          destination: `/store/${storeResult._id}/demo`,
        },
      };
    }

    return {
      props: {
        store: storeResult,
        shipping: shippingResult,
        benefit,
      },
    };
  } catch (error) {
    return {
      props: { error },
    };
  }
};

type Props = {
  store: Store;
  shipping: ShippingData;
  benefit: BenefitView | null;
};

export default function Checkout(props: Props) {
  const priced = usePricedCart(props.benefit, props.shipping);

  const checkout = useCheckoutSubmit({
    storeId: props.store._id,
    storeName: props.store.name,
    primaryShippingAddress: props.store.primaryShippingLocation,
    total: priced.total,
  });

  return (
    <>
      <DemoBanner />
      <StoreLayout title={`Checkout | ${props.store.name}`}>
        <DemoCheckoutStyles>
          <h2>Order Checkout</h2>
          <div className="wrapper">
            <CheckoutForm
              storeId={props.store._id}
              storeName={props.store.name}
              allowDirectShipping={props.store.allowDirectShipping}
              allowStorePickup={props.store.allowStorePickup}
              hasPrimaryShipping={props.store.hasPrimaryShippingLocation}
              primaryShippingAddress={props.store.primaryShippingLocation}
              requireGroupSelection={props.store.requireGroupSelection}
              groupTerm={props.store.groupTerm}
              groups={props.store.groups}
              shipping={props.shipping}
              checkout={checkout}
              priced={priced}
              member={props.benefit?.member ?? null}
            benefitName={props.benefit?.copy.benefitName ?? null}
            />
            <CheckoutSidebar priced={priced} />
          </div>
          <OutOfStockModal
            verifiedItems={checkout.verifiedItems}
            lowerInventoryItems={checkout.lowerInventoryItems}
            outOfStockItems={checkout.outOfStockItems}
            showModal={checkout.showInventoryModal}
            setShowModal={checkout.setShowInventoryModal}
          />
        </DemoCheckoutStyles>
      </StoreLayout>
    </>
  );
}

const DemoCheckoutStyles = styled.div`
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
