import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CartProvider } from '../hooks/useCart';
import { TeacherAppreciationProvider } from '../hooks/useTeacherAppreciation';
import { SheboyganLutheranStaffProvider } from 'hooks/useSheboyganLutheranStaff';
import { SwitchFitnessDiscountProvider } from 'hooks/useSwitchFitness';

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`
);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const cartId = router.query.id || 'default_cart';

  return (
    <Elements stripe={stripePromise}>
      {router.pathname.split('/').includes('store') ? (
        <TeacherAppreciationProvider>
          <SheboyganLutheranStaffProvider>
            <SwitchFitnessDiscountProvider>
              <CartProvider cartId={`cart_${cartId}`}>
                <Component {...pageProps} />
              </CartProvider>
            </SwitchFitnessDiscountProvider>
          </SheboyganLutheranStaffProvider>
        </TeacherAppreciationProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </Elements>
  );
}

export default MyApp;
