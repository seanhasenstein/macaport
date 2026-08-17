import styled from 'styled-components';
import Layout from './Layout';
import { theme, focusRing } from '../styles/theme';

// Shared shell for the privacy policy and terms of service. They are the same
// kind of document and should not drift apart in type, measure, or spacing.
//
// No grid backdrop here. That texture belongs to the pages that open a
// conversation — the hero and the contact form. These are pages people arrive
// at to read one specific thing, usually before deciding to trust us, and the
// most useful thing the design can do is get out of the way.

type Props = {
  title: string;
  updated: string;
  summary: string;
  children: React.ReactNode;
};

export default function LegalPage({
  title,
  updated,
  summary,
  children,
}: Props) {
  return (
    <Layout title={title}>
      <LegalPageStyles>
        <div className="wrapper">
          <header className="masthead">
            <h1>{title}</h1>
            <p className="updated">Last updated {updated}</p>
            <p className="summary">{summary}</p>
          </header>

          <div className="body">{children}</div>
        </div>
      </LegalPageStyles>
    </Layout>
  );
}

const LegalPageStyles = styled.div`
  padding: 0 1.5rem;
  background-color: ${theme.color.surface};

  .wrapper {
    margin: 0 auto;
    padding: 4rem 0 6rem;
    /* Narrower than the marketing max-width. This is running prose and wants a
       reading measure, not the full twelve columns the homepage uses. */
    max-width: 44rem;
    width: 100%;
  }

  .masthead {
    padding: 0 0 2.5rem;
    border-bottom: 1px solid ${theme.color.border};
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: ${theme.color.text};
  }

  .updated {
    margin: 0.875rem 0 0;
    font-size: 0.875rem;
    color: ${theme.color.textSubtle};
  }

  /* The one paragraph most people will read. Set larger than body copy so it
     reads as the summary it is rather than as the first section. */
  .summary {
    margin: 1.5rem 0 0;
    font-size: 1.125rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
    text-wrap: pretty;
  }

  .body {
    margin: 3rem 0 0;
  }

  h2 {
    margin: 3.5rem 0 0;
    font-size: 1.375rem;
    line-height: 1.25;
    font-weight: 700;
    letter-spacing: -0.018em;
    color: ${theme.color.text};

    /* The first heading follows the masthead rule, which is separation enough. */
    &:first-child {
      margin-top: 0;
    }
  }

  h3 {
    margin: 2rem 0 0;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.008em;
    color: ${theme.color.text};
  }

  p {
    margin: 1rem 0 0;
    font-size: 1rem;
    line-height: 1.7;
    color: ${theme.color.textMuted};
    text-wrap: pretty;
  }

  ul {
    margin: 1rem 0 0;
    padding: 0 0 0 1.25rem;
  }

  li {
    margin: 0.5rem 0 0;
    font-size: 1rem;
    line-height: 1.7;
    color: ${theme.color.textMuted};
  }

  li strong,
  p strong {
    font-weight: 600;
    color: ${theme.color.text};
  }

  a {
    color: ${theme.color.brand};
    text-decoration: underline;
    text-underline-offset: 0.15em;

    &:hover {
      color: ${theme.color.brandHover};
    }

    &:focus-visible {
      ${focusRing}
      border-radius: ${theme.radius.sm};
    }
  }

  address {
    margin: 1rem 0 0;
    font-size: 1rem;
    font-style: normal;
    line-height: 1.7;
    color: ${theme.color.textMuted};
  }

  /* A pointer to the other document, after the contact details. It closes the
     page rather than continuing it, so it needs more air above than the gap
     between two paragraphs of the same thought. */
  .related {
    margin-top: 2.5rem;
  }

  /* For the handful of statements that carry more weight than the paragraph
     around them — what we do not do, and where a customer leaves our systems. */
  .callout {
    margin: 1.5rem 0 0;
    padding: 1.25rem 1.375rem;
    background-color: ${theme.color.surfaceMuted};
    border: 1px solid ${theme.color.border};
    border-radius: ${theme.radius.md};

    p:first-child {
      margin-top: 0;
    }
  }

  @media (max-width: 600px) {
    .wrapper {
      padding: 2.5rem 0 4rem;
    }

    h1 {
      font-size: 1.875rem;
    }

    .summary {
      font-size: 1.0625rem;
    }
  }
`;
