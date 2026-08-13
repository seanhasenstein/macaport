import Link from 'next/link';
import styled from 'styled-components';
import { CheckIcon } from '@heroicons/react/20/solid';
import { ContactFormValues } from '../../interfaces';
import { GANG_SHEET } from '../../config/gangSheets';
import { nextStep } from '../../utils/contact';
import {
  theme,
  badge,
  focusRingNeutral,
  gridBackdrop,
  GRID_FADE_SIDES,
  reducedMotion,
} from '../../styles/theme';

type Destination = {
  text: string;
  href: string;
  external?: boolean;
};

// One action per path, and only where a real one exists. A list of links after
// someone has asked a question is a change of subject: they wanted a reply, not
// three other pages. Gang sheets is the only exception, because the builder
// needs no account and there is nothing to wait for.
const PRIMARY_ACTIONS: Record<string, Destination> = {
  'gang-sheets': {
    text: 'Build a gang sheet',
    href: GANG_SHEET.builderUrl,
    external: true,
  },
};

export function Success({
  values,
  referenceId,
}: {
  values: ContactFormValues;
  referenceId?: string;
}) {
  const primary = PRIMARY_ACTIONS[values.inquiryType];

  return (
    <SuccessStyles>
      <div className="card">
        <p className="badge">
          <CheckIcon aria-hidden="true" />
          Message sent
        </p>
        <h1>{values.firstName ? `Thanks, ${values.firstName}.` : 'Thanks.'}</h1>
        <p className="lede">{nextStep(values.inquiryType)}</p>

        {/* The confirmation email is the durable record, so the screen's job is
            to hand off to it. Naming it matters twice over: an unannounced
            email is one nobody goes looking for if it lands in spam, and the
            address shown here is the last moment a typo can be caught. */}
        <div className="handoff">
          <p>
            We have emailed a copy to <strong>{values.email}</strong>. It has
            everything you sent, and a reply goes straight to us.
          </p>
          <p className="correction">
            Wrong address?{' '}
            <Link href="/contact">
              <a>Send another message</a>
            </Link>
            .
          </p>
        </div>

        {/* Going home is an exit, not the thing we want them to do, so it stays
            a link on every path. A lone outlined button reads as an action that
            lost its emphasis; a link reads as a deliberate way out. */}
        <div className="actions">
          {primary ? (
            primary.external ? (
              <a
                className="primary"
                href={primary.href}
                target="_blank"
                rel="noreferrer"
              >
                {primary.text}
              </a>
            ) : (
              <Link href={primary.href}>
                <a className="primary">{primary.text}</a>
              </Link>
            )
          ) : null}
          <Link href="/">
            <a className="quiet">
              Back to home <span aria-hidden="true">&rarr;</span>
            </a>
          </Link>
        </div>

        {/* Out of the reading path on purpose. Nobody copies a code off a
            screen they are about to close, but if the email goes missing this
            is the only thing they have to quote back. */}
        {referenceId ? (
          <p className="reference">Reference #{referenceId}</p>
        ) : null}
      </div>
    </SuccessStyles>
  );
}

const SuccessStyles = styled.div`
  /* Fills whatever main has, so the backdrop reaches the footer even when this
     short screen leaves the window with room to spare. */
  flex: 1;
  padding: 4.5rem 1.5rem 6rem;
  ${gridBackdrop(GRID_FADE_SIDES)}

  .card {
    margin: 0 auto;
    padding: 2rem;
    max-width: 42rem;
    width: 100%;
    background-color: #fff;
    border: 1px solid ${theme.color.border};
    border-radius: ${theme.radius.lg};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.04),
      0 12px 32px -12px rgb(0 0 0 / 0.16);
  }

  .badge {
    ${badge}
    margin: 0 0 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;

    svg {
      height: 0.875rem;
      width: 0.875rem;
    }
  }

  h1 {
    margin: 0;
    font-size: 1.75rem;
    line-height: 1.15;
    font-weight: 700;
    color: ${theme.color.text};
    letter-spacing: -0.025em;
  }

  .lede {
    margin: 0.75rem 0 0;
    font-size: 1rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
    text-wrap: pretty;
  }

  .handoff {
    margin: 1.75rem 0 0;
    padding: 1rem 1.125rem;
    background-color: ${theme.color.surfaceMuted};
    border: 1px solid ${theme.color.border};
    border-radius: ${theme.radius.md};

    p {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.6;
      color: ${theme.color.textMuted};
      text-wrap: pretty;
    }

    strong {
      font-weight: 600;
      color: ${theme.color.text};
      word-break: break-word;
    }

    .correction {
      margin-top: 0.875rem;
    }

    a {
      color: ${theme.color.text};
      text-decoration: underline;
      text-underline-offset: 3px;

      &:hover {
        color: ${theme.color.brand};
      }

      &:focus-visible {
        ${focusRingNeutral}
        border-radius: ${theme.radius.sm};
      }
    }
  }

  .actions {
    margin: 1.5rem 0 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1.25rem;
  }

  .primary {
    padding: 0.6875rem 1.125rem;
    display: inline-flex;
    align-items: center;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #fff;
    background-color: ${theme.color.brandHover};
    border: 1px solid ${theme.color.brandHover};
    border-radius: ${theme.radius.md};
    transition: background-color 150ms ease, border-color 150ms ease;
    ${reducedMotion}

    &:hover {
      background-color: ${theme.color.brandDeep};
      border-color: ${theme.color.brandDeep};
    }

    &:focus-visible {
      ${focusRingNeutral}
    }
  }

  .quiet {
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${theme.color.text};
    transition: color 150ms ease;
    ${reducedMotion}

    span {
      transition: transform 150ms ease;
      display: inline-block;
      ${reducedMotion}
    }

    &:hover {
      color: ${theme.color.brand};

      span {
        transform: translateX(2px);
      }
    }

    &:focus-visible {
      ${focusRingNeutral}
      border-radius: ${theme.radius.sm};
    }
  }

  .reference {
    margin: 1.75rem 0 0;
    padding: 1rem 0 0;
    font-size: 0.8125rem;
    color: ${theme.color.textSubtle};
    border-top: 1px solid ${theme.color.border};
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 600px) {
    padding: 3rem 1rem 4rem;

    .card {
      padding: 1.5rem 1.25rem;
    }

    h1 {
      font-size: 1.5rem;
    }
  }
`;
