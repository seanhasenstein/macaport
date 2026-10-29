import { formatToMoney } from 'utils';

type Props = {
  // Everything the item would cost on its own: the garment plus whatever
  // is being printed on it.
  full: number;
  // What this shopper will actually be charged for it.
  payable: number;
};

// One price, shown the same way everywhere it appears. A free item covers
// the garment and never the printing on it, so a shirt with a $5 name is
// "$5", not "Free" — the headers used to say "Free" regardless, which was
// the only place in the whole flow that disagreed with the cart.
export default function ProductPrice({ full, payable }: Props) {
  if (payable === full) {
    return <>{formatToMoney(full)}</>;
  }

  return (
    <>
      <span className="was">{formatToMoney(full)}</span>
      {payable === 0 ? (
        <span className="free">Free</span>
      ) : (
        formatToMoney(payable)
      )}
    </>
  );
}
