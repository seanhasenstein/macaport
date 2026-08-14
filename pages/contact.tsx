import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Formik, Form, useFormikContext } from 'formik';
import {
  theme,
  focusRingNeutral,
  gridBackdrop,
  GRID_FADE_SIDES,
  reducedMotion,
} from '../styles/theme';
import Layout from '../components/Layout';
import { Success } from 'components/contact/Success';
import ServerError from 'components/contact/ServerError';
import { FieldItem } from 'components/contact/FieldItem';
import { SelectItem } from 'components/contact/SelectItem';
import { CheckboxGroup } from 'components/contact/CheckboxGroup';
import { ContactFormValues, InquiryType } from 'interfaces';
import {
  ARTWORK_OPTIONS,
  DECORATION_OPTIONS,
  DELIVERY_OPTIONS,
  FABRIC_OPTIONS,
  INQUIRY_OPTIONS,
  SHIPPING_OPTIONS,
  OPEN_TIMING_OPTIONS,
  STORE_DURATION_OPTIONS,
  OTHER_PRODUCT_ID,
  PRODUCT_OPTIONS,
  formatPhoneInput,
  initialValues,
  isInquiryType,
  validationSchema,
} from 'utils/contact';

const HEADINGS: Record<
  string,
  {
    eyebrow: string;
    title: string;
    blurb: string;
    messageNote: string;
    submitNote: string;
    submitLabel: string;
  }
> = {
  apparel: {
    eyebrow: 'Custom apparel & embroidery',
    title: 'Get an apparel quote',
    blurb:
      'Tell us what you want printed and about how many. An estimate is enough for us to come back with a real price.',
    messageNote:
      'Anything the questions above missed. Artwork details, sizes, or a deadline we should know about.',
    submitNote:
      "Sending this doesn't place an order. We'll come back with pricing and confirm the details with you first.",
    submitLabel: 'Request a quote',
  },
  'team-store': {
    eyebrow: 'Online team stores',
    title: 'Ask about an online store',
    blurb:
      "Tell us about your group and we'll take it from there. We go through garments, colors, and open dates with you before anything goes live.",
    messageNote:
      "Anything the questions above missed. Personalization, specific brands, or how you'd like the store to work.",
    submitNote:
      "Sending this doesn't create a store. We'll go through the details with you before anything goes live.",
    submitLabel: 'Send your request',
  },
  'gang-sheets': {
    eyebrow: 'DTF gang sheets',
    title: 'Questions about gang sheets?',
    blurb:
      "You don't need a quote to order one. The builder prices it as you go. Use this form if there's something you want to check first.",
    messageNote:
      'What would you like to know? Sizing, artwork, and turnaround come up most often.',
    submitNote: '',
    submitLabel: 'Send your question',
  },
  existing: {
    eyebrow: 'Existing order or store',
    title: 'Question about an order or store?',
    blurb:
      'Whether you ordered something or you run the store, tell us what you need and we will look it up. Either detail below helps, but we can find you by name and email too.',
    messageNote:
      'What do you need help with? Order status, a change, or store dates.',
    submitNote: '',
    submitLabel: 'Send your question',
  },
  'missed-deadline': {
    eyebrow: 'Missed the deadline',
    title: 'Missed your store deadline?',
    // "It happens" without quantifying it. Saying how often we accommodate this
    // would teach people that close dates are soft; saying nothing at all reads
    // as a telling-off to someone who is already apologising.
    blurb:
      'It happens. Tell us which store you missed and we will let you know what we can do.',
    // Deliberately not asking what they wanted. If the store reopens they place
    // the order themselves, so the item details are never needed here — and the
    // store is closed, so they could not look them up anyway. Whether others
    // missed it too is the one answer that changes what we do.
    messageNote:
      'Anything else we should know. If other people in your group missed it too, say so here.',
    // Printing is a reason it might not work, not a rule that it can't. Stated
    // as a possibility on both sides, since that is what is actually true.
    submitNote:
      "There is a chance we can reopen the store for you. If the group's order has already been printed, it may not be possible.",
    submitLabel: 'Send your request',
  },
};

const DEFAULT_HEADING = {
  eyebrow: 'General inquiry',
  title: 'Get in touch',
  blurb:
    "Tell us what you have in mind and we'll get back to you. If it's about an order, choosing an option above lets us ask the right questions.",
  messageNote: 'How can we help you?',
  submitNote: '',
  submitLabel: 'Send your message',
};

// Switching paths has to clear the previous path's answers. Formik keeps every
// value it has ever held, so without this someone who filled in the apparel
// questions and then switched to gang sheets would silently submit garment
// quantities attached to a gang sheet enquiry.
const TYPE_SPECIFIC: Partial<ContactFormValues> = {
  organization: '',
  products: [],
  quantities: {},
  productOther: '',
  orderNumber: '',
  decoration: '',
  fabric: [],
  colors: '',
  artwork: '',
  delivery: '',
  shipping: [],
  neededBy: '',
  groupSize: '',
  openTiming: '',
  storeDuration: '',
};

// Clears the previous path's answers and keeps ?about= honest, so reloading
// or sharing the link lands on the path actually being filled in. Shallow, so
// getServerSideProps doesn't re-run and reset the form underneath the user.
function SyncInquiryType() {
  const router = useRouter();
  const { values, setValues } = useFormikContext<ContactFormValues>();
  // Seeded with the current type so the ?about= preset survives mount.
  const previous = React.useRef(values.inquiryType);

  React.useEffect(() => {
    if (previous.current === values.inquiryType) return;

    previous.current = values.inquiryType;
    setValues(current => ({ ...current, ...TYPE_SPECIFIC }));

    const query = { ...router.query };
    if (values.inquiryType) query.about = values.inquiryType;
    else delete query.about;

    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  }, [values.inquiryType, setValues, router]);

  return null;
}

type Props = {
  presetType: InquiryType | '';
};

// The hero links here with ?about=apparel / ?about=team-store. Resolving that
// on the server rather than from router.query means the heading and the
// preselected type are right on the first paint, with no flash of the generic
// "Contact Us" copy while the router catches up.
export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  return {
    props: { presetType: isInquiryType(query.about) ? query.about : '' },
  };
};

export default function Contact({ presetType }: Props) {
  const [status, setStatus] = React.useState<'IDLE' | 'SUCCESS' | 'ERROR'>(
    'IDLE'
  );
  // Kept so the success screen can confirm what was actually sent.
  const [submitted, setSubmitted] = React.useState<ContactFormValues | null>(
    null
  );
  const [referenceId, setReferenceId] = React.useState<string>();
  const [throttled, setThrottled] = React.useState(false);

  // The success screen is far shorter than the form it replaces, so the browser
  // clamps the old scroll position to the new page height instead of resetting
  // it. After a long form that lands somewhere near the footer, with the
  // confirmation pushed above the fold.
  React.useEffect(() => {
    if (status === 'SUCCESS') {
      window.scrollTo(0, 0);
    }
  }, [status]);

  const formValues: ContactFormValues = {
    ...initialValues,
    inquiryType: presetType,
  };

  // "Wrong address?" is what sends people back here, so they are returning to
  // fix one field rather than to start again. Formik unmounts while the success
  // screen is up, so what it was given last time is gone unless it is handed
  // back — and retyping a dozen answers to correct a typo in one is the kind of
  // thing that loses the enquiry entirely.
  const handleReset = () => {
    setThrottled(false);
    setReferenceId(undefined);
    setStatus('IDLE');
  };

  const handleSubmit = async (values: ContactFormValues) => {
    if (values.honeypot) return;

    const response = await fetch('/api/send-message', {
      method: 'post',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      setThrottled(response.status === 429);
      setStatus('ERROR');
      return;
    } else {
      // The message is already sent by this point, so a body that will not
      // parse costs the reference number and nothing else. The success screen
      // leaves the line out rather than showing an empty one.
      try {
        const body = await response.json();
        setReferenceId(body?.referenceId);
      } catch (err) {
        console.error('Could not read the reference number', err);
      }

      setSubmitted(values);
      setStatus('SUCCESS');
    }
  };

  return (
    <Layout>
      <>
        {status === 'SUCCESS' && submitted ? (
          <Success
            values={submitted}
            referenceId={referenceId}
            onReset={handleReset}
          />
        ) : (
          <ContactStyles>
            <div className="wrapper">
              <Formik
                initialValues={submitted ?? formValues}
                validationSchema={validationSchema}
                onSubmit={values => handleSubmit(values)}
              >
                {({ isSubmitting, values }) => {
                  // Reads the live field, not the ?about= it arrived with, so
                  // changing the select can't leave the page titled "Get an
                  // apparel quote" above a team store enquiry.
                  const heading =
                    HEADINGS[values.inquiryType] ?? DEFAULT_HEADING;

                  return (
                    <>
                      <p className="eyebrow">{heading.eyebrow}</p>
                      <h1>{heading.title}</h1>
                      <p className="lede">{heading.blurb}</p>
                      <Form noValidate>
                        <SyncInquiryType />
                        <SelectItem
                          name="inquiryType"
                          label="What is this about?"
                          options={INQUIRY_OPTIONS}
                        />
                        <div className="grid-cols-2">
                          <FieldItem name="firstName" label="First Name" />
                          <FieldItem name="lastName" label="Last Name" />
                        </div>
                        <FieldItem type="email" name="email" label="Email" />
                        <FieldItem
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          name="phone"
                          label="Phone"
                          placeholder="(920) 555-0134"
                          format={formatPhoneInput}
                        />

                        {values.inquiryType === 'apparel' && (
                          <>
                            <CheckboxGroup
                              name="products"
                              label="What items do you need, and how many?"
                              note="An estimate is fine, and a range like 20-40 works. There is no minimum. We print a single item or thousands."
                              options={PRODUCT_OPTIONS}
                              quantityName="quantities"
                            />
                            {values.products.includes(OTHER_PRODUCT_ID) && (
                              <FieldItem
                                name="productOther"
                                label="What else are you looking for?"
                                placeholder="e.g. aprons, socks, koozies"
                              />
                            )}
                            <SelectItem
                              name="decoration"
                              label="Printed or embroidered?"
                              options={DECORATION_OPTIONS}
                            />
                            <SelectItem
                              name="artwork"
                              label="Do you have artwork ready?"
                              note="We can design it for you if not. Just say so."
                              options={ARTWORK_OPTIONS}
                              optional
                            />
                            {/* Everything below here is optional, which is why
                                it can be collapsed — nothing inside can fail
                                validation, so no error can hide in here. */}
                            <details className="more">
                              <summary>Add more detail (optional)</summary>
                              <div className="more-body">
                                <CheckboxGroup
                                  name="fabric"
                                  label="Fabric"
                                  optional
                                  options={FABRIC_OPTIONS}
                                />
                                <FieldItem
                                  name="colors"
                                  label="Garment colors"
                                  placeholder="e.g. navy and white, or not sure yet"
                                  optional
                                />
                                <FieldItem
                                  type="date"
                                  name="neededBy"
                                  label="Needed by"
                                  optional
                                />
                                <SelectItem
                                  name="delivery"
                                  label="Pickup or shipping?"
                                  options={DELIVERY_OPTIONS}
                                  optional
                                />
                                <FieldItem
                                  name="organization"
                                  label="Team or organization"
                                  optional
                                />
                              </div>
                            </details>
                          </>
                        )}

                        {values.inquiryType === 'team-store' && (
                          <>
                            <FieldItem
                              name="organization"
                              label="Organization or group"
                              note="This usually becomes the name of the store."
                            />
                            <SelectItem
                              name="openTiming"
                              label="When would you like it open?"
                              options={OPEN_TIMING_OPTIONS}
                              optional
                            />
                            <SelectItem
                              name="storeDuration"
                              label="How long should it stay open?"
                              note="Most run about two weeks. They can also stay open permanently."
                              options={STORE_DURATION_OPTIONS}
                              optional
                            />
                            <FieldItem
                              type="date"
                              name="neededBy"
                              label="When do you need the orders?"
                              note="We print once the store closes, and orders are usually ready about two weeks after that. Tell us the date you need them in hand."
                              optional
                            />
                            <CheckboxGroup
                              name="products"
                              label="What would you like it to sell?"
                              note="Unlimited print colors at no extra charge."
                              optional
                              options={PRODUCT_OPTIONS}
                            />
                            {values.products.includes(OTHER_PRODUCT_ID) && (
                              <FieldItem
                                name="productOther"
                                label="What else would you like it to sell?"
                                placeholder="e.g. aprons, socks, koozies"
                              />
                            )}
                            <SelectItem
                              name="decoration"
                              label="Printed or embroidered?"
                              options={DECORATION_OPTIONS}
                              optional
                            />
                            <SelectItem
                              name="artwork"
                              label="Do you have artwork ready?"
                              note="We can design it for you if not. Just say so."
                              options={ARTWORK_OPTIONS}
                              optional
                            />
                            <details className="more">
                              <summary>Add more detail (optional)</summary>
                              <div className="more-body">
                                <FieldItem
                                  name="groupSize"
                                  label="Approximate group size"
                                  placeholder="e.g. 40"
                                  optional
                                />
                                <CheckboxGroup
                                  name="shipping"
                                  label="How should people get their orders?"
                                  note="A store can offer any combination of these."
                                  optional
                                  options={SHIPPING_OPTIONS}
                                />
                              </div>
                            </details>
                          </>
                        )}

                        {values.inquiryType === 'missed-deadline' && (
                          <FieldItem
                            name="organization"
                            label="Which store did you miss?"
                            note="The group or team name the store was set up under."
                            placeholder="e.g. Lincoln High School Band"
                          />
                        )}

                        {values.inquiryType === 'existing' && (
                          <div className="grid-cols-2">
                            <FieldItem
                              name="organization"
                              label="Store name"
                              placeholder="e.g. Lincoln High School Band"
                              optional
                            />
                            <FieldItem
                              name="orderNumber"
                              label="Order number"
                              placeholder="e.g. 8FK2QP"
                              optional
                            />
                          </div>
                        )}

                        {values.inquiryType === 'gang-sheets' && (
                          <p className="builder-note">
                            Gang sheets are self-serve.{' '}
                            <a
                              href="https://sheets.macaport.com/editor"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Build one in the editor
                            </a>{' '}
                            and check out without waiting on us. Send a message
                            below if you have a question first.
                          </p>
                        )}

                        <FieldItem
                          as="textarea"
                          name="message"
                          label="Message"
                          note={heading.messageNote}
                        />
                        {/* aria-hidden, not just sr-only. sr-only is the clip
                            pattern, which hides this visually while keeping it
                            in the accessibility tree — the opposite of what a
                            honeypot wants. A screen reader user would meet a
                            field telling them not to fill it in, and if it ever
                            held a value the submit button below disables with
                            nothing to explain why. autoComplete off keeps a
                            browser from walking into the same dead end. */}
                        <div className="sr-only" aria-hidden="true">
                          <FieldItem
                            name="honeypot"
                            label="Please do not fill this field out"
                            tabIndex="-1"
                            autoComplete="off"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={values.honeypot !== ''}
                          className="button"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner" />
                              <span className="sr-only">Loading</span>
                            </>
                          ) : (
                            heading.submitLabel
                          )}
                        </button>
                        <p className="submit-note">
                          {heading.submitNote ? `${heading.submitNote} ` : ''}
                          We&apos;ll follow up by email or phone, and only use
                          your details to reply. See our{' '}
                          <Link href="/privacy-policy">
                            <a>privacy policy</a>
                          </Link>
                          .
                        </p>
                        <ServerError
                              serverError={status === 'ERROR'}
                              throttled={throttled}
                            />
                      </Form>
                    </>
                  );
                }}
              </Formik>
            </div>
          </ContactStyles>
        )}
      </>
    </Layout>
  );
}

const ContactStyles = styled.div`
  flex: 1;
  padding: 0 1.5rem;
  ${gridBackdrop(GRID_FADE_SIDES)}

  .wrapper {
    margin: 0 auto;
    padding: 4.5rem 0 6rem;
    max-width: 42rem;
    width: 100%;
  }

  .eyebrow {
    margin: 0 0 0.875rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${theme.color.brand};
  }

  h1 {
    margin: 0;
    font-size: 2.25rem;
    line-height: 1.15;
    font-weight: 700;
    color: ${theme.color.text};
    letter-spacing: -0.028em;
    text-wrap: balance;
  }

  .lede {
    margin: 1.125rem 0 0;
    font-size: 1.0625rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
  }

  /* The form sits in the same white card as the gang sheet configurator on
     the homepage, so the two pages read as one product. */
  form {
    margin: 2.25rem 0 0;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    background-color: ${theme.color.surface};
    border: 1px solid ${theme.color.border};
    border-radius: ${theme.radius.lg};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.04),
      0 12px 32px -12px rgb(0 0 0 / 0.16);
  }

  /* Collapsed by default. Only optional fields live in here, so nothing that
     can fail validation is ever hidden behind it. */
  /* Left aligned with the rest of the form. Centred, two short lines under a
     full width button read as a tombstone and fight the label alignment. */
  .submit-note {
    margin: 1.25rem 0 0;
    text-align: left;
    font-size: 0.75rem;
    line-height: 1.5;
    color: ${theme.color.textMuted};
    text-wrap: pretty;

    a {
      color: ${theme.color.text};
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  .more {
    margin: 1.75rem 0 0;
    padding: 1rem 1.125rem;
    background-color: ${theme.color.surfaceMuted};
    border: 1px solid ${theme.color.borderStrong};
    border-radius: ${theme.radius.md};
  }

  .more > summary {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${theme.color.text};
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }

    &::before {
      content: '+';
      margin: 0 0.5rem 0 0;
      font-weight: 500;
      color: ${theme.color.textMuted};
    }

    &:focus-visible {
      ${focusRingNeutral}
      border-radius: ${theme.radius.sm};
    }
  }

  .more[open] > summary::before {
    content: '−';
  }

  .more-body {
    margin: -0.25rem 0 0.75rem;
  }

  /* The card already has padding; the first field's own top margin doubled it. */
  form > *:first-child {
    margin-top: 0;
  }

  .grid-cols-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0 1rem;
  }

  .builder-note {
    margin: 1.25rem 0 0;
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: ${theme.color.textMuted};
    background-color: ${theme.color.brandSubtle};
    border: 1px solid ${theme.color.brandBorder};
    border-radius: ${theme.radius.md};

    a {
      font-weight: 600;
      color: ${theme.color.brand};
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  .button {
    margin: 1.75rem 0 0;
    padding: 0;
    position: relative;
    width: 100%;
    height: 3rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: ${theme.color.neutral};
    color: ${theme.color.onNeutral};
    font-size: 0.9375rem;
    font-weight: 600;
    border: none;
    border-radius: ${theme.radius.md};
    cursor: pointer;
    transition: background-color 150ms ease;
    ${reducedMotion}

    &:hover {
      background-color: ${theme.color.neutralHover};
    }

    &:focus-visible {
      ${focusRingNeutral}
    }
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  .spinner:before {
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
    border-top: 2px solid rgba(255, 255, 255, 0.5);
    border-right: 2px solid transparent;
    animation: spinner 0.6s linear infinite;
  }

  @media (max-width: 600px) {
    .wrapper {
      padding: 3rem 0 4rem;
    }

    h1 {
      font-size: 1.75rem;
    }

    form {
      padding: 1.25rem;
    }
  }
`;
