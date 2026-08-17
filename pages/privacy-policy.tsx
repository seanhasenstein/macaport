import LegalPage from '../components/LegalPage';

// Rewritten from the software rather than from a template. Every claim below
// traces to something in this repo: the collections in db/, the third parties
// in utils/mailgun.ts, utils/payment.ts and the Momentec iframes on the
// sublimation and headwear pages, and the absence of any analytics dependency in package.json.
//
// The rule for editing this page: if the code changes what happens to a
// customer's data, this changes in the same commit. A policy that describes
// software we no longer run is worse than no policy, because the gap between
// what it claims and what we do is itself the problem.
//
// The trackers named in the Momentec section were read off that site's own
// content-security-policy header, not guessed at. If those pages ever stop
// framing a third-party catalog, the "what we do not do" block gets simpler
// and this page should be simplified with it.
//
// TODO before publishing: the AWS line is only true once the email logo moves
// off Cloudinary. utils/email.ts still points at res.cloudinary.com.
export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="August 16, 2026"
      summary="We collect what we need to print your order and get it to you, and nothing else. We run no analytics of our own, we put no advertising trackers on this site, and we do not sell anyone's information."
    >
      <h2>Who we are</h2>
      <p>
        Macaport LLC is a custom apparel printing and embroidery company in New
        London, Wisconsin. This policy covers www.macaport.com and the online
        team stores we host on it.
      </p>
      <address>
        Macaport LLC
        <br />
        3080 Frederick Farm Ln. Suite 101
        <br />
        New London, WI 54961
        <br />
        <a href="mailto:support@macaport.com">support@macaport.com</a>
      </address>

      <h2>What we collect</h2>

      <h3>When you place an order</h3>
      <p>
        Your name, email address, phone number, and — if the order ships — your
        shipping address. We keep a record of what you ordered, the sizes and
        quantities, any personalization you asked for, and what you paid.
      </p>

      <h3>When you send us a message</h3>
      <p>
        Your name, email address, phone number, and whatever you write in the
        message. Depending on what your enquiry is about, the form may also ask
        for your organization, your event and its dates, or an order number.
        Everything beyond your contact details and the message itself is
        optional.
      </p>

      <h3>When a school sends us a teacher list</h3>
      <p>
        Schools and districts sometimes send us a list of teacher email
        addresses so we can offer those teachers a discount. Those addresses
        come to us from the school, not from the teachers, and we use them for
        nothing except checking whether an email address is eligible for that
        year&apos;s discount. These lists contain email addresses only. They do
        not contain student information of any kind.
      </p>

      <h3>Automatically</h3>
      <p>
        Our host records ordinary web server logs — the IP address a request
        came from, the page requested, the browser, and the time. We use these
        to keep the site running and to investigate abuse. We do not build
        profiles from them.
      </p>

      <h2>What we do not do</h2>
      <div className="callout">
        <p>
          <strong>We do not run analytics.</strong> No Google Analytics, no
          advertising pixels, no session recording, no third-party tracking
          scripts of any kind. Nothing we have put on this site is measuring
          what you look at. The one exception is the embedded catalog on our
          sublimation and headwear pages, which belongs to another company and
          brings its own trackers — described below.
        </p>
        <p>
          <strong>We do not sell or rent your information</strong> to anyone,
          and we do not share it for anyone else&apos;s marketing.
        </p>
        <p>
          <strong>We never see your card number.</strong> Card details go
          directly from your browser to Stripe and never reach our servers.
        </p>
      </div>

      <h2>Cookies and browser storage</h2>
      <p>
        We do not set tracking cookies. Two pages on this site — the
        sublimation and headwear pages — save your selections in your
        browser&apos;s local storage so your choices survive while you browse.
        That information stays on your device and is never sent to us.
      </p>
      <p>
        Those same two pages embed a catalog from Momentec Brands, which is a
        different company and does set its own cookies, including advertising
        ones. See below.
      </p>

      <h2>Other companies involved</h2>
      <p>
        Running this site means handing some information to companies that do
        specific jobs for us. This is the complete list.
      </p>
      <ul>
        <li>
          <strong>Stripe</strong> processes payments and receives your card
          details, name, and billing information directly.{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">
            Stripe&apos;s privacy policy
          </a>
        </li>
        <li>
          <strong>Mailgun</strong> delivers our email. It handles the recipient
          address and the full contents of every message we send, including
          order confirmations and replies to enquiries.{' '}
          <a
            href="https://www.mailgun.com/legal/privacy-policy/"
            target="_blank"
            rel="noreferrer"
          >
            Mailgun&apos;s privacy policy
          </a>
        </li>
        <li>
          <strong>MongoDB Atlas</strong> stores our orders, stores, and contact
          enquiries.{' '}
          <a
            href="https://www.mongodb.com/legal/privacy/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            MongoDB&apos;s privacy policy
          </a>
        </li>
        <li>
          <strong>Vercel</strong> hosts the site and keeps the server logs
          described above.{' '}
          <a
            href="https://vercel.com/legal/privacy-notice"
            target="_blank"
            rel="noreferrer"
          >
            Vercel&apos;s privacy notice
          </a>
        </li>
        <li>
          <strong>Amazon Web Services</strong> serves our images — the product
          photos on every store page, and the logo in our emails. Because
          images load from their servers, AWS receives your IP address when you
          browse a store, and again if you open one of our emails with images
          switched on. That second one also tells them roughly when you opened
          it, which is true of essentially all email and is not something we
          track or look at.{' '}
          <a href="https://aws.amazon.com/privacy/" target="_blank" rel="noreferrer">
            AWS privacy notice
          </a>
        </li>
      </ul>

      <h2>Two places you leave our systems</h2>
      <p>
        These matter more than the list above, because in both cases the page
        still looks like ours.
      </p>

      <h3>The gang sheet builder at sheets.macaport.com</h3>
      <div className="callout">
        <p>
          The gang sheet builder runs on <strong>Heddley</strong>, a separate
          company, on a web address that uses our name. You are still buying
          from Macaport — we are the seller and the payment goes to us — but
          the software is Heddley&apos;s, and so are the records.
        </p>
        <p>
          The artwork you upload, the sheet you build, and the name, email
          address, and order details you enter at checkout are stored in
          Heddley&apos;s systems rather than ours. If you want that information
          corrected or deleted, tell us and we will pass it on, but Heddley
          holds it and{' '}
          <a href="https://www.heddley.com/privacy" target="_blank" rel="noreferrer">
            their privacy policy
          </a>{' '}
          governs it.
        </p>
      </div>

      <h3>The sublimation and headwear pages</h3>
      <div className="callout">
        <p>
          Both pages embed a catalog served directly by{' '}
          <strong>Momentec Brands</strong>, formerly Augusta Sportswear.
          Because the catalog loads from their servers, Momentec receives your
          IP address and can set its own cookies whenever you view those pages,
          whether or not you order anything.
        </p>
        <p>
          <strong>
            The catalog carries advertising and analytics trackers of its own
          </strong>{' '}
          — among them Google, Facebook, LinkedIn, and Criteo. Those are
          Momentec&apos;s, not ours, and they are the one place on this site
          where you are tracked by an advertising network. We do not receive
          what you browse there and we get nothing from those trackers.{' '}
          <a
            href="https://resources.momentecbrands.com/en_us/momentec-brands-privacy-policy-B1q8Aa31x"
            target="_blank"
            rel="noreferrer"
          >
            Momentec&apos;s privacy policy
          </a>
        </p>
      </div>

      <h2>Names printed on garments</h2>
      <p>
        When you add a name, number, or other personalization to an order, we
        store it as part of that order because it is what we have to print. If
        you are ordering for someone else — a player on a team, or your child —
        that information is about them rather than about you, and we treat it
        the same way we treat the rest of the order: we use it to make the
        garment and for nothing else.
      </p>

      <h2>How long we keep things</h2>
      <ul>
        <li>
          <strong>Orders</strong> — seven years, because they are business and
          tax records.
        </li>
        <li>
          <strong>Contact enquiries</strong> — three years.
        </li>
        <li>
          <strong>Teacher discount lists</strong> — through the program year
          they were sent for, then deleted.
        </li>
        <li>
          <strong>Server logs</strong> — two weeks, which is how long our host
          keeps them.
        </li>
      </ul>

      <h2>Your choices</h2>
      <p>
        Email <a href="mailto:support@macaport.com">support@macaport.com</a>{' '}
        and we will tell you what we have about you, correct anything wrong, or
        delete it. We will not ask why.
      </p>
      <p>
        Two honest limits. We cannot delete an order we are legally required to
        keep as a tax record, and for anything held by Stripe, Heddley, or
        Momentec we can pass your request along but cannot act on their
        systems ourselves.
      </p>

      <h2>Children</h2>
      <p>
        This site is meant for adults. We do not knowingly collect information
        directly from children under 13. Orders for a child are placed by a
        parent, coach, or school, and any name we hold for a young person
        reaches us that way rather than from the child. If you believe a child
        has given us information directly, email us and we will remove it.
      </p>

      <h2>Security</h2>
      <p>
        Information is stored on managed services with access limited to the
        people who run Macaport. Payment card details never reach our systems
        at all. No system is perfectly secure, and we would rather say that
        plainly than promise otherwise.
      </p>

      <h2>Changes</h2>
      <p>
        If we change how any of this works, we will change this page and update
        the date at the top.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href="mailto:support@macaport.com">support@macaport.com</a> and
        a person will answer.
      </p>
    </LegalPage>
  );
}
