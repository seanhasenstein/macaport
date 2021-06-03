import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CartProvider } from '../hooks/useCart';

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`
);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const cartId = router.query.slug || 'default_cart';

  return (
    <Elements stripe={stripePromise}>
      <CartProvider cartId={`cart_${cartId}`}>
        <Component {...pageProps} />
      </CartProvider>
    </Elements>
  );
}

export default MyApp;
