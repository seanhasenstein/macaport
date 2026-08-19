import Link from 'next/link';
import LegalPage from '../components/LegalPage';

// Written from how Macaport actually sells, not from a template. The previous
// version carried a mandatory arbitration clause naming the American
// Arbitration Association, which nobody here chose and which would have made a
// disputed $60 order cost more to arbitrate than to reprint.
//
// Two things worth knowing before editing:
//
// Final sale is the substantive term on this page. It is defensible because
// the goods are made to order and cannot be resold, but it only stays fair if
// the exception for our own mistakes is real. Do not weaken that exception.
//
// Gang sheets are sold through sheets.macaport.com, which runs on Heddley's
// platform. Macaport is still the seller and the payment lands in Macaport's
// account, so these terms cover those orders even though the software is not
// ours. See the privacy policy for where that data lives.
//
// TODO: onsite printing has no deposit, cancellation, or weather terms because
// nobody has decided what they are. The section says what is true today —
// that the details are agreed in writing per event — and should be replaced
// once Nick settles on standard terms.
export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of service"
      updated="August 16, 2026"
      summary="What you can expect from us and what we need from you. The short version: custom printed goods are final sale, you keep the rights to your artwork, and if we get something wrong we fix it."
    >
      <h2>Who these cover</h2>
      <p>
        These terms are between you and Macaport LLC, a Wisconsin limited
        liability company in New London, Wisconsin. They apply to
        www.macaport.com, the online team stores we host, and the gang sheet
        builder at sheets.macaport.com. By ordering from us you agree to them.
      </p>
      <p>
        The gang sheet builder runs on software operated by another company,
        but you are buying from Macaport and these terms govern that purchase.
      </p>

      <h2>Placing an order</h2>
      <p>
        An order is a request until we accept it. We accept by starting
        production or by telling you directly, and we may decline an order for
        any lawful reason — a design we will not print, a quantity we cannot
        source, a date we cannot meet. If we decline after you have paid, you
        get a full refund.
      </p>
      <p>
        Team store orders close on the date shown on the store. Once a store
        closes we produce what was ordered, and orders cannot be added,
        changed, or cancelled after that point.
      </p>

      <h2>Prices and payment</h2>
      <p>
        Prices are in US dollars and include the decoration described on the
        product. Sales tax is added where it applies. Payment is taken at
        checkout through Stripe; we never see or store your card number.
      </p>
      <p>
        If a price is listed wrongly through an obvious error, we will tell you
        before producing the order and you can confirm at the corrected price or
        cancel for a full refund. We will not quietly charge you the difference.
      </p>

      <h2>Custom printed goods are final sale</h2>
      <div className="callout">
        <p>
          Everything we print or embroider is made for you specifically. Once a
          garment has your design on it, it cannot be restocked or sold to
          anyone else, so we cannot accept returns, exchanges, or size changes
          on decorated goods — including a size you ordered and later decided
          was wrong.
        </p>
        <p>
          <strong>This does not apply when the mistake is ours.</strong> If we
          send the wrong item, print the wrong design, misspell a name we were
          given correctly, or the garment arrives defective, tell us within{' '}
          <strong>14 days</strong> of receiving it and we will reprint it or
          refund it. That is our decision to make, but you will get one or the
          other.
        </p>
      </div>
      <p>
        Check the size chart before ordering, and check the spelling of any
        name or number you send us — we print what we are given. If you are not
        sure about sizing, ask us before the order closes and we will help.
      </p>

      <h2>Your artwork</h2>
      <p>
        <strong>You keep ownership of anything you upload or send us.</strong>{' '}
        Uploading a logo does not give us any claim to it.
      </p>
      <p>
        You give us permission to use your artwork for the work you have asked
        for — reproducing it, sizing it, and printing or embroidering it onto
        garments — and to show photographs of the finished work as examples of
        what we do. If you would rather we did not show your work, tell us and
        we will not.
      </p>
      <p>
        In return, you confirm that you have the right to have the artwork
        printed: that you own it, or you have permission from whoever does. If
        someone tells us you did not, you agree to cover the costs we face as a
        result, including reasonable legal fees.
      </p>
      <p>
        We may decline to print anything we believe infringes someone
        else&apos;s rights, and we may decline artwork we would rather not put
        our name to. We do not have to explain why, and declining is not a
        judgment about you.
      </p>

      <h2>Turnaround and delivery</h2>
      <p>
        Dates we give you are estimates based on what we know at the time. We
        take them seriously and we will tell you as soon as we know a date has
        slipped, but garment stock, artwork changes, and shipping are not
        entirely within our control, so a date is not a guarantee unless we have
        agreed one in writing.
      </p>
      <p>
        Risk passes to you on delivery, or when you collect from us. If a
        shipment arrives damaged, keep the packaging and tell us — we will sort
        it out with the carrier.
      </p>

      <h2>Onsite printing at events</h2>
      <p>
        Onsite printing is arranged event by event. What we bring, what the
        venue provides, the hours we are there, and who pays for what are
        agreed with you in writing before the event, and those arrangements sit
        alongside these terms.
      </p>

      <h2>Using this site</h2>
      <p>
        Use the site for its purpose: browsing, ordering, and getting in touch.
        Do not attempt to break into it, scrape it wholesale, overload it, or
        use it to send anyone anything they did not ask for. The site&apos;s
        own text, photographs, and design belong to Macaport.
      </p>

      <h2>What we are responsible for</h2>
      <p>
        We stand behind our work, and the section on final sale says exactly
        what we do when we get an order wrong. Beyond putting the order right,
        our responsibility for any claim connected to an order is limited to
        what you paid for it.
      </p>
      <p>
        We are not responsible for indirect losses — an event that went ahead
        without the shirts, revenue you expected to make from them, or similar
        knock-on costs. Some states do not allow limits like these, and where
        that is the case this paragraph does not apply to you.
      </p>
      <p>
        Nothing here limits our responsibility for anything the law does not
        let us limit.
      </p>

      <h2>If something goes wrong between us</h2>
      <p>
        Email us first. Nearly everything is settled by a reprint or a refund
        within a day or two, and we would rather fix a problem than argue about
        it.
      </p>
      <p>
        If that fails, these terms are governed by the laws of the State of
        Wisconsin, and any dispute belongs in the state or federal courts of
        Wisconsin. You are not giving up your right to bring a claim in small
        claims court.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The version that applies to your order is
        the one published when you placed it, and the date at the top of this
        page tells you when it last changed.
      </p>

      <h2>Contact</h2>
      <address>
        Macaport LLC
        <br />
        3080 Frederick Farm Ln. Suite 101
        <br />
        New London, WI 54961
        <br />
        <a href="mailto:support@macaport.com">support@macaport.com</a>
      </address>
      <p className="related">
        See also our{' '}
        <Link href="/privacy-policy">
          <a>privacy policy</a>
        </Link>
        , which covers what we do with your information.
      </p>
    </LegalPage>
  );
}
