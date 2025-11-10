import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';

import { connectToDb, shipping, store } from 'db';

import { getStoreStatus } from 'utils/store';
import { useCart } from '../../../hooks/useCart';
import { getUrlParameter } from '../../../utils';
import useCheckoutSubmit from 'hooks/useCheckoutSubmit';
import { useTeacherAppreciation } from 'hooks/useTeacherAppreciation';
import { useSheboyganLutheranStaff } from 'hooks/useSheboyganLutheranStaff';
import { useSwitchFitnessDiscount } from 'hooks/useSwitchFitness';

import StoreLayout from '../../../components/store/layouts/StoreLayout';
import CheckoutForm from '../../../components/store/checkout/CheckoutForm';
import OutOfStockModal from '../../../components/store/checkout/OutOfStockModal';
import CheckoutSidebar from 'components/store/checkout/CheckoutSidebar';

import { ShippingData, Store } from '../../../interfaces';

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = getUrlParameter(context.query.id);

    if (!id) {
      throw new Error("A store id is required but wasn't provided");
    }

    const db = await connectToDb();
    const storeResult = await store.getStoreById(db, id);
    const shippingResult = await shipping.getShippingDetails(db);

    const hasPrimaryShipping = storeResult?.hasPrimaryShippingLocation;
    const hasInStorePickup = storeResult?.allowStorePickup;
    const hasDirectShipping = storeResult?.allowDirectShipping;

    const onlyDirectShipping =
      !!hasDirectShipping && !hasInStorePickup && !hasPrimaryShipping;

    if (!storeResult) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-not-found',
        },
      };
    }

    const isStoreActive = getStoreStatus(
      storeResult.openDate,
      storeResult.closeDate
    );

    if (isStoreActive === false) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-closed',
        },
      };
    }

    return {
      props: {
        store: storeResult,
        shipping: shippingResult,
        onlyDirectShipping,
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
  onlyDirectShipping: boolean;
};

export default function Checkout(props: Props) {
  const {
    alreadyUsed: alreadyUsedForSheboyganLutheranStaff,
    isEligible: isEligibleForSheboyganLutheranStaff,
  } = useSheboyganLutheranStaff();

  const cart = useCart({
    sheboyganLutheranStaffEligible:
      isEligibleForSheboyganLutheranStaff &&
      !alreadyUsedForSheboyganLutheranStaff,
  });

  const checkout = useCheckoutSubmit({
    storeId: props.store._id,
    storeName: props.store.name,
    primaryShippingAddress: props.store.primaryShippingLocation,
    cartTotal: cart.cartTotal,
    isSwitchFitnessStore:
      !!props.store.meta?.isSwitchFitness &&
      !!props.store.meta?.switchFitnessDiscountId,
    isEligibleForSheboyganLutheranStaffFromClient:
      isEligibleForSheboyganLutheranStaff &&
      !alreadyUsedForSheboyganLutheranStaff,
  });

  const {
    email: teacherAppreciationEmail,
    isEligible,
    alreadyUsed,
  } = useTeacherAppreciation();

  const {
    isEligible: isEligibleForSwitchFitnessDiscount,
    alreadyUsed: alreadyUsedForSwitchFitnessDiscount,
  } = useSwitchFitnessDiscount();

  const isSwitchFitnessStore =
    !!props.store.meta?.isSwitchFitness &&
    !!props.store.meta?.switchFitnessDiscountId;
  const applySwitchFitnessDiscount =
    isSwitchFitnessStore &&
    isEligibleForSwitchFitnessDiscount &&
    !alreadyUsedForSwitchFitnessDiscount;

  const isTeacherAppreciationStore = !!props.store.teacherAppreciationId;
  const cartHasFreeItem = cart.items.some(
    item => item.itemTotal === 0 && item.quantity === 1
  );
  const eligibleForTeacherAppreciation =
    isTeacherAppreciationStore && isEligible && !alreadyUsed;

  const isSheboyganLutheranStaffStore = !!props.store.sheboyganLutheranStaffId;
  const applySheboyganLutheranStaffDiscount =
    isSheboyganLutheranStaffStore &&
    isEligibleForSheboyganLutheranStaff &&
    !alreadyUsedForSheboyganLutheranStaff;

  return (
    <StoreLayout title={`Checkout | ${props.store.name}`}>
      <CheckoutStyles>
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
            setVerifiedItems={checkout.setVerifiedItems}
            setLowerInventoryItems={checkout.setLowerInventoryItems}
            setOutOfStockItems={checkout.setOutOfStockItems}
            setShowInventoryModal={checkout.setShowInventoryModal}
            checkout={checkout}
            applySheboyganLutheranStaffDiscount={
              applySheboyganLutheranStaffDiscount
            }
            onlyDirectShipping={props.onlyDirectShipping}
            shippingPrice={props.shipping.price}
            shippingFreeMinimum={props.shipping.freeMinimum}
          />
          <CheckoutSidebar
            cartSubtotal={cart.cartSubtotal}
            cartShipping={cart.shipping}
            cartTotal={cart.cartTotal}
            items={cart.items}
            salesTax={cart.salesTax}
            {...{
              cartHasFreeItem,
              isTeacherAppreciationStore,
              teacherAppreciationEmail,
              eligibleForTeacherAppreciation,
              applySwitchFitnessDiscount,
              applySheboyganLutheranStaffDiscount,
              onlyDirectShipping: props.onlyDirectShipping,
              shippingPrice: props.shipping.price,
              shippingFreeMinimum: props.shipping.freeMinimum,
            }}
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
