import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { BanknotesIcon, GiftIcon, TagIcon } from '@heroicons/react/24/outline';

import { BenefitView } from 'interfaces';
import { benefitStatus, benefitTerms } from 'utils/benefitDisplay';

type Props = {
  storeId: string;
  benefit: BenefitView;
  // Whether any product this benefit covers sells a priced add-on. Decides
  // whether the terms mention that add-ons are charged. The page works it
  // out, because only the page has the product list.
  paidAddons?: boolean;
};

const money = (cents: number) =>
  cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;

// What is on offer, in one sentence, before anyone signs in: who it is for,
// what they get, and what happens when they press the button. A client can
// replace it with their own instructions from the dashboard; most will not
// need to.
//
// The member label carries who it is for on its own. Pasting the store name
// in front of it read badly, because a store is usually named after the
// client already: "Lincoln Elementary Staff Appreciation staff get...".
function defaultInstructions(benefit: BenefitView) {
  const label = benefit.copy.memberLabel.trim();
  const who = label.charAt(0).toUpperCase() + label.slice(1);
  const what =
    benefit.type === 'credit'
      ? `get ${money(benefit.amount)} to spend in this store`
      : benefit.type === 'discount'
      ? `get ${money(benefit.amount)} off an order in this store`
      : `get ${
          benefit.amount === 1
            ? 'one free item'
            : `${benefit.amount} free items`
        } from this store`;
  return `${who} ${what}. Enter your email and we'll send you a code to activate it.`;
}

type Step = 'email' | 'code';

// Kept in step with CODE_TTL_MS in core/verification/code.ts by hand: that
// module imports node's crypto, so pulling the constant from it would drag
// crypto into the browser bundle for the sake of one number.
const CODE_MINUTES = 10;

// The one card for every member benefit. Everything a client can change
// about it (its name, what the people are called, the instructions, a logo)
// comes from the benefit's copy; everything else is written once here.
//
// It holds no eligibility state of its own. Verifying sets a cookie on the
// server, and the page's props are re-fetched, so what the card shows is
// always what the server just said.
export default function MemberBenefitCard({
  storeId,
  benefit,
  paidAddons = true,
}: Props) {
  const router = useRouter();
  const { copy, member } = benefit;

  const [step, setStep] = React.useState<Step>('email');
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const [cooldownUntil, setCooldownUntil] = React.useState(0);
  const [, tick] = React.useReducer((n: number) => n + 1, 0);
  const codeInput = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (step === 'code') codeInput.current?.focus();
  }, [step]);

  const cooldownLeft = Math.max(
    0,
    Math.ceil((cooldownUntil - Date.now()) / 1000)
  );

  React.useEffect(() => {
    if (cooldownLeft <= 0) return;
    const id = window.setTimeout(tick, 1000);
    return () => window.clearTimeout(id);
  }, [cooldownLeft]);

  const refresh = () =>
    router.replace(router.asPath, undefined, { scroll: false });

  const post = async (path: string, body: Record<string, unknown>) => {
    const response = await fetch(`/api/member-benefits/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return {
      ok: response.ok,
      status: response.status,
      data: await response.json(),
    };
  };

  const requestCode = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setBusy(true);
    setError(undefined);
    setMessage(undefined);

    try {
      const { ok, status, data } = await post('request-code', {
        storeId,
        email,
      });

      if (status === 429) {
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else if (!ok) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else if (data.status === 'notMember') {
        setError(
          `This email isn't on the ${copy.memberLabel.toLowerCase()} list.`
        );
      } else if (data.status === 'cooldown') {
        setCooldownUntil(Date.now() + data.retryAfterSeconds * 1000);
        setStep('code');
      } else {
        setStep('code');
        setCooldownUntil(Date.now() + 30 * 1000);
        const notes = [];
        if (data.resent)
          notes.push('Sent again. It carries the same code as before.');
        if (data.redirected) {
          notes.push(
            `Test environment: your code was sent to ${data.deliveredTo} instead of ${email}.`
          );
        }
        setMessage(notes.length ? notes.join(' ') : undefined);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    setMessage(undefined);

    try {
      const { ok, status, data } = await post('verify-code', {
        storeId,
        email,
        code,
      });

      if (status === 429) {
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else if (!ok) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else if (data.status === 'ok') {
        setCode('');
        await refresh();
      } else if (data.status === 'wrong') {
        setError(
          `That code isn't right. ${data.attemptsLeft} ${
            data.attemptsLeft === 1 ? 'try' : 'tries'
          } left.`
        );
      } else if (data.status === 'lockedOut') {
        setError('Too many wrong codes. Request a new one to try again.');
      } else {
        setError('That code has expired. Request a new one.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    try {
      await post('sign-out', { storeId });
      setStep('email');
      setEmail('');
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const startOver = () => {
    setStep('email');
    setCode('');
    setError(undefined);
    setMessage(undefined);
  };

  // The slot above the title is always filled, so a client without a logo
  // does not look like one who forgot. Not Macaport's mark: the benefit is
  // the client's, and the store header already carries ours. A neutral icon
  // for the kind of benefit says what the card is at a glance.
  const TypeIcon =
    benefit.type === 'credit'
      ? BanknotesIcon
      : benefit.type === 'discount'
      ? TagIcon
      : GiftIcon;
  const logo = copy.logo ? (
    <div className="logo">
      <img src={copy.logo} alt="" />
    </div>
  ) : (
    <div className="logo logo-placeholder" aria-hidden="true">
      <TypeIcon className="type-icon" />
    </div>
  );

  // Signed in. What they see depends on their standing, not on anything
  // this browser remembers. The title stays the benefit's own name, the
  // same string the signed-out card shows, so verifying does not rename
  // the thing in front of them.
  if (member) {
    const status = benefitStatus(benefit, paidAddons);

    return (
      <CardStyles>
        {logo}
        <h3 className="title">{copy.benefitName}</h3>
        {status ? (
          <>
            <div className="balance">
              <p className={`status-label ${status.tone}`}>{status.label}</p>
              {status.headline ? (
                <p className="headline">
                  {status.headline}
                  {status.note ? (
                    <span className="headline-note">{status.note}</span>
                  ) : null}
                </p>
              ) : null}
              <p className="paragraph">{status.detail}</p>
            </div>
          </>
        ) : null}
        <div className="account">
          <p className="signed-in-as">{member.email}</p>
          <button
            type="button"
            className="text-button"
            onClick={signOut}
            disabled={busy}
          >
            Use a different email
          </button>
        </div>
      </CardStyles>
    );
  }

  if (!benefit.active) {
    return (
      <CardStyles>
        {logo}
        <h3 className="title">{copy.benefitName}</h3>
        <p className="paragraph">
          The {copy.benefitName} is currently paused. Please check back later.
        </p>
      </CardStyles>
    );
  }

  if (step === 'code') {
    return (
      <CardStyles>
        {logo}
        <h3 className="title">Check your email</h3>
        <p className="paragraph">
          {/* "Enter it below" said nothing the labelled field underneath
              does not. How long they have is the thing someone who comes
              back to this screen actually wants to know. */}
          We sent a 6-digit code to <strong>{email}</strong>. It expires in{' '}
          {CODE_MINUTES} minutes.
        </p>
        <form onSubmit={verifyCode}>
          <div className="field-item">
            <label htmlFor="benefit-code">Code</label>
            <input
              id="benefit-code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              ref={codeInput}
              value={code}
              onChange={e => setCode(e.target.value)}
              disabled={busy}
            />
          </div>
          <button
            type="submit"
            className="primary-button"
            disabled={busy || code.replace(/\D/g, '').length < 6}
          >
            {busy ? <LoadingSpinner /> : 'Verify'}
          </button>
          {error ? <div className="validation-error">{error}</div> : null}
          {message ? <div className="note">{message}</div> : null}
          <div className="secondary-actions">
            <button
              type="button"
              className="text-button"
              onClick={() => requestCode()}
              disabled={busy || cooldownLeft > 0}
            >
              {cooldownLeft > 0 ? `Resend in ${cooldownLeft}s` : 'Resend code'}
            </button>
            <button type="button" className="text-button" onClick={startOver}>
              Use a different email
            </button>
          </div>
        </form>
      </CardStyles>
    );
  }

  return (
    <CardStyles>
      {logo}
      <h3 className="title">{copy.benefitName}</h3>
      <p className="paragraph">
        {copy.instructions || defaultInstructions(benefit)}
      </p>
      <form onSubmit={requestCode}>
        <div className="field-item">
          <label htmlFor="benefit-email">Email Address</label>
          <input
            id="benefit-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
            disabled={busy}
          />
        </div>
        <button type="submit" className="primary-button" disabled={busy}>
          {busy ? <LoadingSpinner /> : 'Email me a code'}
        </button>
        {error ? <div className="validation-error">{error}</div> : null}
        <p className="fine-print">{benefitTerms(benefit, paidAddons)}</p>
      </form>
    </CardStyles>
  );
}

const CardStyles = styled.div`
  margin: 0 auto;
  padding: 1.75rem 2rem 1.5rem;
  max-width: 22rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* The grid stretches this to the height of the product tiles beside it,
     which left the content hanging from the top with dead space under it.
     Centred, the card reads as composed at whatever height it is given. */
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  text-align: center;

  form {
    width: 100%;
  }

  .logo-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.75rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;

    .type-icon {
      height: 1.5rem;
      width: 1.5rem;
      color: #4b5563;
    }
  }

  .logo {
    width: 2.75rem;
    margin: 0 auto 0.625rem;

    img {
      width: 100%;
      height: auto;
    }
  }

  .title {
    margin: 0;
    color: #000;
    font-size: 1.125rem;
    line-height: 1.35;
  }

  /* The state, in a word. A label rather than a pill: inside the panel a
     pill was a box within a box, and outside it, it was a second object
     competing with the frame. As type it sits in the panel's own rhythm
     and is still the one element whose colour carries meaning. */
  .status-label {
    margin: 0 0 0.5rem;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;

    &.active {
      color: #047857;
    }

    &.spent {
      color: #6b7280;
    }

    &.paused {
      color: #92400e;
    }
  }

  /* What they came back to find, given a frame of its own. Spacing alone
     left it as one more line of centred text among several; the panel is
     what makes the card read as zones rather than as a stack. Neutral
     rather than green, because the same panel carries the paused and
     used-up messages, where green would be a lie. */
  .balance {
    margin: 1.125rem 0 0;
    padding: 1rem;
    width: 100%;
    background-color: #f8f9fa;
    /* The card's own border colour. Lighter than this and the panel read
       as a fill with no edge, which is most of why it still looked like
       loose text rather than a frame. */
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .headline {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    color: #111827;
  }

  .balance .headline {
    margin: 0;
  }

  .headline-note {
    margin-left: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
  }

  .balance .paragraph {
    margin: 0.5rem 0 0;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: #6b7280;
  }

  .paragraph {
    margin: 0.75rem 0 0;
    padding: 0;
    max-width: unset;
    width: unset;
    font-size: 0.875rem;
    color: #1f2937;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .field-item {
    margin: 1.5rem 0 0;
    display: flex;
    flex-direction: column;

    label {
      margin: 0 0 0.625rem;
      text-align: left;
    }

    input {
      padding: 0.6875rem 0.75rem;
      font-size: 0.9375rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;

      &[name='code'] {
        text-align: center;
        font-size: 1.25rem;
        letter-spacing: 0.3em;
      }
    }
  }

  .primary-button {
    margin: 1rem 0 0;
    padding: 0.75rem 1.25rem;
    width: 100%;
    min-height: 2.625rem;
    line-height: 1.3;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #31363f;
    color: #f3f4f5;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.011em;
    border: 1px solid #181a1e;
    border-radius: 0.25rem;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: default;
    }
  }

  /* Three groups, read in order: whose benefit it is, what it is worth,
     and who is signed in. The spacing inside each is tighter than the
     spacing between them, which is what makes them read as groups at all;
     the rule is there because the last one is a different kind of thing
     from the two above it, not decoration. */
  .account {
    margin: 1.25rem 0 0;
    width: 100%;
  }

  /* Who they are signed in as answers a question nobody asks twice. As a
     bordered box with a heading it was the largest element on the card,
     above the balance it exists to support. */
  .signed-in-as {
    margin: 0;
    font-size: 0.8125rem;
    line-height: 1.4;
    color: #6b7280;
    word-wrap: break-word;
  }

  .signed-in-as + .text-button {
    margin-top: 0.5rem;
  }

  .text-button {
    margin: 1.25rem 0 0;
    padding: 0;
    background-color: transparent;
    border: none;
    color: #31363f;
    font-size: 0.8125rem;
    text-decoration: underline;
    cursor: pointer;

    &:hover:not(:disabled) {
      color: #4b5563;
    }

    &:disabled {
      color: #9ca3af;
      cursor: default;
    }
  }

  .secondary-actions {
    display: flex;
    justify-content: center;
    gap: 1.25rem;
  }

  .validation-error {
    margin: 0.75rem 0 0;
    color: #be123c;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.4;
  }

  .note {
    margin: 0.75rem 0 0;
    color: #047857;
    font-size: 0.8125rem;
  }

  .fine-print {
    margin: 1rem 0 0;
    font-size: 0.75rem;
    line-height: 1.5;
    color: #6b7280;
  }

  @media (min-width: 768px) {
    padding-top: 1.125rem;
  }
`;

const LoadingSpinner = styled.span`
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border-top: 2px solid #fff;
    border-right: 2px solid transparent;
    animation: spinner 0.6s linear infinite;
  }
`;
