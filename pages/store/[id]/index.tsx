import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { format } from 'date-fns';

import { connectToDb, store as storeModel } from 'db';

import { getUrlParameter } from 'utils';
import { getStoreStatus } from 'utils/store';
import { getBenefitView } from 'utils/memberBenefit';
import {
  benefitCoversPaidAddons,
  membersOnlyLockout,
} from 'utils/benefitDisplay';
import { usePricedCart } from 'hooks/usePricedCart';

import StoreLayout from '../../../components/store/layouts/StoreLayout';
import StoreItem from '../../../components/store/home/StoreItem';
import StoreHomepageError from 'components/store/errors/StoreHomepageError';
import StoreAnnouncement from 'components/store/common/StoreAnnouncement';
import MemberBenefitCard from 'components/store/home/MemberBenefitCard';

import { BenefitView, Store, StoreProduct } from '../../../interfaces';

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
          destination: `/store-closed?store=${store._id}`,
        },
      };
    }

    // Built from the benefit document and this browser's session cookie, so
    // what the page says about the member is what the server just decided.
    const benefit = await getBenefitView(db, store, context.req);

    return { props: { store, benefit } };
  } catch (error) {
    // A string, not the Error. Next requires props to be JSON serializable, so
    // returning the Error threw during serialization and the request 500d
    // before the component — and its error state — ever ran.
    //
    // This page is the only one of seven fixed. product, cart, checkout and
    // the three demo pages still return the Error and still 500 on a database
    // they cannot reach; cart's guard is commented out with a TODO and
    // checkout has none at all. They were left because in four or five years
    // the database has never been unreachable in production, and the branded
    // pages/500.tsx now catches all of them, so what is left is the difference
    // between a decent error page and a slightly better one — not worth
    // editing checkout for. Fix one when you are in it for another reason.
    // This function and the guard below are the pattern; pages/stores.tsx is
    // the other.
    console.error('Store homepage could not load', error);

    return {
      props: { error: 'unavailable' },
    };
  }
};

type Props = {
  store: Store;
  benefit?: BenefitView | null;
  error?: string;
};

export default function StoreHomepage(props: Props) {
  const benefit = props.benefit ?? null;
  const priced = usePricedCart(benefit, null);

  // Below every hook, above every read of props.store. It used to sit further
  // down still, past half a dozen reads of a store that does not exist when
  // the page failed to load — so the component threw before it could reach its
  // own error state.
  //
  // It cannot move above the hooks either. Next reuses this component when you
  // navigate from one store to another, so props.error can flip without a
  // remount, and returning early before the hooks would render fewer hooks
  // than the previous render. React throws on that.
  if (props.error || !props.store) {
    return <StoreHomepageError />;
  }

  const hasCloseDate = !!props.store.closeDate;
  const hasAnnouncement = !!props.store.announcement;

  // A members-only store shows the sign-in card and nothing else until the
  // browser holds a verified session.
  const locked = membersOnlyLockout(benefit);

  // Only the page holds the product list, so the card is told whether any
  // product the benefit covers can be personalized for a price.
  const paidAddons =
    !!benefit &&
    benefitCoversPaidAddons(benefit, props.store.products ?? []);

  // "Free" on a product tile when adding it would cost nothing: a free-item
  // benefit with room left, for a product it covers.
  const member = benefit?.member ?? null;
  const freeItemFor = (product: StoreProduct) =>
    !!benefit &&
    benefit.type === 'freeItem' &&
    !!member &&
    member.reason === 'eligible' &&
    (benefit.productIds === null || benefit.productIds.includes(product.id)) &&
    member.remaining > priced.freeUnitsInCart;

  return (
    <StoreLayout title={`${props.store.name}`}>
      <StoreStyles
        hasCloseDate={hasCloseDate}
        hasAnnouncement={hasAnnouncement}
        hasBenefit={!!benefit}
      >
        {props.store.closeDate && (
          <div className="close-date">
            <span>
              This store will close on{' '}
              {format(
                new Date(props.store.closeDate),
                "LLL do, yyyy 'at' h:mmaaa"
              )}
            </span>
          </div>
        )}
        {props.store.announcement ? (
          <div className="announcement">
            <StoreAnnouncement text={props.store.announcement} />
          </div>
        ) : null}
        <h2 className="store-name">
          <span>{props.store.name}</span>
        </h2>
        {!props.store.products || props.store.products.length < 1 ? (
          <div className="no-products">
            <div className="wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                This store currently has no products available. Contact us with
                any questions at{' '}
                <a href="mailto:support@macaport.com">support@macaport.com</a>.
              </p>
            </div>
          </div>
        ) : (
          <div className="items">
            {benefit ? (
              <MemberBenefitCard
                storeId={props.store._id}
                benefit={benefit}
                paidAddons={paidAddons}
              />
            ) : null}
            {locked
              ? null
              : props.store.products.map((p: StoreProduct) => (
                  <StoreItem
                    key={p.id}
                    item={p}
                    storeId={props.store._id}
                    isDemo={false}
                    eligibleForFreeItem={freeItemFor(p)}
                  />
                ))}
          </div>
        )}
      </StoreStyles>
    </StoreLayout>
  );
}

const StoreStyles = styled.div<{
  hasCloseDate: boolean;
  hasAnnouncement: boolean;
  hasBenefit: boolean;
}>`
  .store-name,
  p {
    text-align: center;
  }

  .close-date {
    margin: 3rem 0 0;
    padding: 0 1.5rem;
    display: flex;
    justify-content: center;
    width: 100%;

    span {
      padding: 0.6875rem 1.625rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #590b19;
      text-align: center;
      line-height: 1.5;
      background-color: #fbdee3;
      border: 2px solid #f9cdd5;
      border-radius: 0.5rem;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      /* Stacked on the announcement, it takes the same width so the two
         read as one block. Alone it stays sized to its text. */
      ${props =>
        props.hasAnnouncement ? 'width: 100%; max-width: 40rem;' : ''}
    }
  }

  .store-name {
    margin: ${props =>
        props.hasCloseDate || props.hasAnnouncement ? '2.25rem' : '4.25rem'}
      auto 0;
    padding: 0 1.5rem;
    font-size: 1.625rem;
    color: #111827;
    line-height: 1.35;
  }

  p {
    margin: 0 auto;
    padding: 0 1.5rem;
    max-width: 32rem;
    width: 100%;
    color: #6e788c;
    line-height: 1.5;
  }

  .no-products {
    margin: 0 auto;
    padding: 0 1.5rem;
    max-width: 60rem;
    width: 100%;

    .wrapper {
      margin: 3rem 0;
      padding: 1.5rem 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
    }

    p {
      font-size: 1rem;
      color: #4b5563;
      text-align: center;

      a {
        color: #4f46e5;
        text-decoration: underline;
      }
    }

    svg {
      margin: 0 0 0.5rem;
      height: 1.5rem;
      width: 1.5rem;
      color: #ec4763;
    }
  }

  /* Sits with the close date, above the name, so the name stays the heading
     over the products. */
  .announcement {
    margin: ${props => (props.hasCloseDate ? '1rem' : '3rem')} 0 0;
    padding: 0 1.5rem;
  }

  .items {
    margin: ${props => (props.hasBenefit ? '3.5rem' : '4rem')} auto 3rem;
    padding: 0 1.5rem;
    max-width: 72rem;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(1px, 22rem));
    gap: 1.5rem;
    justify-content: center;
  }

  @media (max-width: 1024px) {
    .items {
      padding: 0 1.5rem;
    }
  }

  @media (max-width: 767px) {
    .close-date {
      margin-top: 1.5rem;
    }
    .announcement {
      margin-top: ${props => (props.hasCloseDate ? '1rem' : '1.5rem')};
    }
    .store-name {
      margin: ${props =>
          props.hasCloseDate || props.hasAnnouncement ? '2.25rem' : '3rem'}
        auto 0;
    }

    .items {
      margin-top: 2.875rem;
    }
  }
`;
