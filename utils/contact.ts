import * as Yup from 'yup';
import { ContactFormValues, InquiryType } from 'interfaces';
import { formatPhoneNumber, removeNonDigits } from 'utils';

// The hero links here with ?about=<value>, so these values are part of the
// URL contract. Changing one breaks the links in components/home/Hero.tsx.
// "New" and "Setting up" are load-bearing. Without them, someone chasing an
// order they already placed picks the closest match and gets asked what
// garments they'd like — and the enquiry arrives looking like a fresh lead.
export const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: 'apparel', label: 'A new custom apparel order' },
  { value: 'team-store', label: 'Setting up an online store' },
  { value: 'gang-sheets', label: 'DTF gang sheets' },
  { value: 'existing', label: 'A question about an existing order or store' },
  { value: 'missed-deadline', label: "I missed a store's order deadline" },
  { value: 'other', label: 'Something else' },
];

// Ids rather than bare labels: quantities are keyed by id, and a Formik field
// path can't contain the dots or brackets a free-text label might pick up later.
export const PRODUCT_OPTIONS = [
  { id: 'tshirts', label: 'T-shirts' },
  { id: 'long-sleeve', label: 'Long sleeve tees' },
  { id: 'hoodies', label: 'Hoodies & crewnecks' },
  { id: 'polos', label: 'Polos' },
  { id: 'quarter-zips', label: 'Quarter zips' },
  { id: 'jackets', label: 'Jackets' },
  { id: 'shorts', label: 'Shorts' },
  { id: 'sweatpants', label: 'Sweatpants & joggers' },
  { id: 'hats', label: 'Hats' },
  { id: 'bags', label: 'Bags & backpacks' },
  { id: 'blankets', label: 'Blankets' },
  { id: 'other', label: 'Something else' },
];

export const OTHER_PRODUCT_ID = 'other';

// Separate from the garment list on purpose: printing and embroidery are how
// an item is decorated, not items you can order a quantity of.
// Spelled out rather than a bare "Both". These land in the notification email
// as the answer on their own line, where "Decoration: Both" would leave whoever
// reads it scrolling back to work out both of what.
export const DECORATION_OPTIONS = [
  'Printed',
  'Embroidered',
  'Both printed and embroidered',
  'Not sure, help me decide',
];

// Checkboxes, not a select: a single order can mix cotton tees with
// performance polos, and a select would force one answer to stand for both.
// No "Not sure yet" option — leaving them all unchecked already says that.
// "Performance / moisture-wicking" rather than a brand name: Dri-FIT is Nike's
// trademark and only applies to Nike product.
export const FABRIC_OPTIONS = [
  { id: 'cotton', label: 'Cotton' },
  { id: 'blend', label: 'Cotton / poly blend' },
  { id: 'performance', label: 'Performance / moisture-wicking' },
  { id: 'other', label: 'Something else' },
];

// Mirrors the three independent flags a real store carries in the Store model
// (allowStorePickup / hasPrimaryShippingLocation / allowDirectShipping), which
// is why this is a multi-select — a store can offer any combination.
// Four, not three. "Store pickup" covered two different operations — every
// buyer collecting their own, and the organizer collecting them to hand out —
// which no description can disambiguate, because a single box ticked for both
// tells Macaport nothing about which to set up.
//
// None of these describe what will happen, because a store can offer several
// and each buyer picks at checkout. "Everyone gets their order posted to them"
// is only true if posting is the sole option, and "you collect the whole order"
// stops being true the moment individual pickup is offered alongside it. The
// note on the field carries that once instead of hedging every line.
//
// "Picked up" and "shipped", not "collected" and "posted". Macaport and its
// customers are in Wisconsin, and the second pair reads as someone else's
// English.
//
// "At Macaport in New London" rather than either alone: which company is
// ambiguous in a form about setting up a store, and where decides whether a
// group can realistically collect at all.
export const SHIPPING_OPTIONS = [
  {
    id: 'pickup',
    label: 'Individual pickup',
    description: 'Picked up at Macaport in New London by whoever ordered it.',
  },
  {
    id: 'pickup-group',
    label: 'Group pickup',
    description:
      'You pick the orders up at Macaport in New London and hand them out.',
  },
  {
    id: 'primary',
    label: 'Ship to one address',
    description: 'Shipped to any address you choose, and you hand the orders out.',
  },
  {
    id: 'direct',
    label: 'Ship to each person',
    description: "Shipped to each buyer's own address, at their own cost.",
  },
];

// Three states rather than a yes/no. "Needs design help" is a different job
// from "print this file", and knowing which one up front saves the exchange
// that would otherwise establish it.
export const ARTWORK_OPTIONS = [
  'Yes, print-ready',
  'I have something rough',
  'No, I need help with design',
];

export const DELIVERY_OPTIONS = [
  // "Local" leaves both who and where unsaid, in the one option where a lead
  // needs to judge whether collecting is realistic for them.
  'Free pickup at Macaport in New London',
  'Shipped to me',
  'Not sure yet',
];

type Choice = { id: string; label: string };

const labelFor = (options: Choice[], id: string) =>
  options.find(option => option.id === id)?.label ?? id;

export const productLabel = (id: string) => labelFor(PRODUCT_OPTIONS, id);

export const joinLabels = (options: Choice[], ids: string[] = []) =>
  ids.map(id => labelFor(options, id)).join(', ');

// When it should go live. "Open permanently" moved to STORE_DURATION_OPTIONS —
// it answers how long the store runs, not when it starts.
export const OPEN_TIMING_OPTIONS = [
  'As soon as possible',
  'Within a month',
  'One to three months',
  'More than three months out',
  'Not sure yet',
];

export const STORE_DURATION_OPTIONS = [
  'About a week',
  'About two weeks',
  'About a month',
  'Open permanently',
  'Not sure yet',
];

// Formats as you type, capped at 10 digits. Reuses formatPhoneNumber so the
// shape shown in the field and the shape in the notification email can't drift.
//
// The `previous` value is what makes deleting work. Backspacing over one of the
// inserted characters — the bracket, space, or dash — removes no digit, so
// reformatting would put it straight back and the field would look frozen.
// When the digits haven't changed but the text got shorter, drop a digit instead.
export const formatPhoneInput = (next: string, previous: string) => {
  let digits = removeNonDigits(next).slice(0, 10);

  if (next.length < previous.length && digits === removeNonDigits(previous)) {
    digits = digits.slice(0, -1);
  }

  return formatPhoneNumber(digits);
};

// What happens next, per path. Shared because it appears both on the success
// screen and in the customer's confirmation email; two copies would drift.
const NEXT_STEPS: Record<string, string> = {
  apparel: 'We will put a price together and get back to you.',
  // Not "before anything goes live", which takes it as given that it will.
  // Whether Macaport can take the store on at all — the dates, the group size,
  // the artwork — is still an open question at this point, and the copy should
  // not answer it on Macaport's behalf. "What we can do" is the same honest
  // framing the missed-deadline path uses.
  'team-store':
    'We will go through garments, colors, and dates with you and let you know what we can do.',
  'gang-sheets': 'We will get back to you with an answer.',
  existing: 'We will look it up and get back to you.',
  'missed-deadline':
    'We will check that store and let you know what we can do.',
};

export const nextStep = (inquiryType: string) =>
  NEXT_STEPS[inquiryType] ?? 'We will get back to you.';

// What the form says above the submit button, restated for the confirmation
// email. Deliberately not the same strings: on the form it is "sending this
// doesn't place an order", and by the time this is read it has been sent, so
// the tense has to move. Only the paths where the misunderstanding is expensive
// carry one — a gang sheet question cannot be mistaken for an order.
// Each says something the next step above it does not. Repeating "we will come
// back with pricing" one line below "we will put a price together" wastes the
// most emphasised box in the email on an echo — what it is there to prevent is
// someone believing they have already ordered.
const CONFIRMATION_NOTES: Record<string, string> = {
  apparel:
    'This is not an order. Nothing gets printed until you have approved the price and the details.',
  // Phrased as a constraint on what has happened, like the apparel note, rather
  // than a promise about what will. "You will see it and approve it" made the
  // customer the last remaining gate, when Macaport has not agreed to it yet.
  'team-store':
    'This does not create a store. Nothing is set up until we have gone through the details and dates with you.',
  'missed-deadline':
    'There is a chance we can reopen the store for you. If the group’s order has already been printed, it may not be possible.',
};

export const confirmationNote = (inquiryType: string) =>
  CONFIRMATION_NOTES[inquiryType] ?? '';

export const isInquiryType = (value: unknown): value is InquiryType =>
  INQUIRY_OPTIONS.some(option => option.value === value);

export const inquiryLabel = (value: string) =>
  INQUIRY_OPTIONS.find(option => option.value === value)?.label ?? value;

export const initialValues: ContactFormValues = {
  inquiryType: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
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
  message: '',
  honeypot: '',
};

// Apparel needs to know what and how many, since neither can be guessed from
// the other; a store can't be set up without knowing whose store it is.
// Everything else is offered but optional.
export const validationSchema = Yup.object().shape({
  inquiryType: Yup.string().required('Please tell us what this is about'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('A valid email is required')
    .required('Email address is required'),
  phone: Yup.string()
    .transform(value => {
      return removeNonDigits(value);
    })
    .matches(new RegExp(/^\d{10}$/), 'Phone number must be 10 digits')
    .required('Phone number is required'),
  // Required on two paths for different reasons, so the message differs: a new
  // store needs a name, and a late order can't be found without knowing which
  // store it was for.
  organization: Yup.string().test(
    'organization-required',
    'This field is required',
    function (value) {
      const { inquiryType } = this.parent;
      if (value?.trim()) return true;

      if (inquiryType === 'team-store') {
        return this.createError({
          message: 'An organization or group name is required',
        });
      }

      if (inquiryType === 'missed-deadline') {
        return this.createError({ message: 'Please tell us which store' });
      }

      return true;
    }
  ),
  products: Yup.array().when('inquiryType', {
    is: 'apparel',
    then: Yup.array().min(1, 'Please choose at least one item'),
  }),
  // One quantity per selected item, checked together rather than field by
  // field — six separate errors under one group reads as a wall of red.
  quantities: Yup.object().test(
    'quantity-per-selected-item',
    'Add a quantity for each item you selected',
    function (value) {
      const { inquiryType, products } = this.parent;
      if (inquiryType !== 'apparel') return true;

      return ((products as string[]) ?? []).every(
        id =>
          String((value as Record<string, string>)?.[id] ?? '').trim() !== ''
      );
    }
  ),
  decoration: Yup.string().when('inquiryType', {
    is: 'apparel',
    then: Yup.string().required('Please choose how it should be decorated'),
  }),
  // Only asked for when the catch-all option is picked, and then it's the
  // only thing telling us what the item actually is.
  productOther: Yup.string().when('products', {
    is: (products: string[]) => (products ?? []).includes(OTHER_PRODUCT_ID),
    then: Yup.string().required('Please tell us what the other item is'),
  }),
  message: Yup.string().required('A message is required'),
});
