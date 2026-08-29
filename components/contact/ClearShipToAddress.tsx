import React from 'react';
import { useFormikContext } from 'formik';

import { ContactFormValues } from 'interfaces';
import { SHIPPED_TO_ME } from 'utils/contact';

/**
 * Drops the shipping address once the order stops being shipped.
 *
 * The address field only renders while delivery says shipped, and unmounting an
 * input does not clear what Formik holds for it. Without this, someone who picks
 * shipping, types an address, then changes their mind still submits it — and the
 * record ends up carrying an address beside a delivery answer that contradicts
 * it, which is a question rather than an answer for whoever reads it next.
 *
 * Switching back to pickup is the customer retracting the address, which is the
 * part that makes this worth doing rather than leaving to the email guard. The
 * two other fields with this shape — productOther and personalizationOther —
 * hold a garment name and a personalization note; this one holds somebody's
 * address, and a retracted one should not reach the database at all.
 *
 * The notification email guards the row as well. Belt and braces on purpose,
 * the same way the honeypot is stripped in db/contactMessage.ts even though the
 * endpoint already rejects it: either check could be moved later, and the guard
 * still has to cover records written before this existed.
 *
 * Rendered rather than called, because a hook that clears a field has to live
 * inside the Formik tree. Lives here rather than beside SyncInquiryType in
 * pages/contact.tsx because it needs nothing from the page.
 */
export function ClearShipToAddress() {
  const { values, setFieldValue } = useFormikContext<ContactFormValues>();
  const shipping = values.delivery === SHIPPED_TO_ME;
  const address = values.shipToAddress;

  React.useEffect(() => {
    // Guarded on there being something to clear, so this is inert on mount and
    // on every keystroke while the field is still on screen.
    if (shipping || !address) return;

    setFieldValue('shipToAddress', '');
  }, [shipping, address, setFieldValue]);

  return null;
}
