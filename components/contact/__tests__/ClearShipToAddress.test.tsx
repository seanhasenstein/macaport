import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Formik, Form } from 'formik';

import { ClearShipToAddress } from '../ClearShipToAddress';
import { ContactFormValues } from '../../../interfaces';
import { initialValues, SHIPPED_TO_ME } from '../../../utils/contact';

// Renders the component inside a real Formik tree and prints the value it is
// responsible for, so each test can assert on what would actually be submitted.
function harness(overrides: Partial<ContactFormValues> = {}) {
  let setFieldValue: (field: string, value: string) => void = () => undefined;

  render(
    <Formik initialValues={{ ...initialValues, ...overrides }} onSubmit={() => undefined}>
      {formik => {
        setFieldValue = formik.setFieldValue;
        return (
          <Form>
            <ClearShipToAddress />
            <span data-testid="address">{formik.values.shipToAddress}</span>
          </Form>
        );
      }}
    </Formik>
  );

  return {
    address: () => screen.getByTestId('address').textContent,
    // Awaited inside act because Formik's setFieldValue resolves after its own
    // validation pass, and the effect under test then runs on the render that
    // follows. Without both, the assertion races the clear it is checking for.
    set: async (field: string, value: string) => {
      await act(async () => {
        await setFieldValue(field, value);
      });
    },
  };
}

describe('the shipping address, once the order stops being shipped', () => {
  it('is dropped when the answer changes back to pickup', async () => {
    // The field unmounts, but Formik keeps what was typed into it. Left alone,
    // the record carries an address the customer has already taken back.
    const form = harness({
      delivery: SHIPPED_TO_ME,
      shipToAddress: '123 Main St, New London, WI 54961',
    });

    expect(form.address()).toBe('123 Main St, New London, WI 54961');

    await form.set('delivery', 'Free pickup at Macaport in New London');

    expect(form.address()).toBe('');
  });

  it('is dropped when the answer is cleared entirely', async () => {
    // "Not sure yet" and an unanswered select are the same case as pickup:
    // anything other than shipping means no address should be submitted.
    const form = harness({
      delivery: SHIPPED_TO_ME,
      shipToAddress: '123 Main St, New London, WI 54961',
    });

    await form.set('delivery', 'Not sure yet');

    expect(form.address()).toBe('');
  });

  it('is left alone while the order is still being shipped', async () => {
    const form = harness({
      delivery: SHIPPED_TO_ME,
      shipToAddress: '123 Main St, New London, WI 54961',
    });

    await form.set('shipToAddress', '456 Water St, Appleton, WI 54911');

    expect(form.address()).toBe('456 Water St, Appleton, WI 54911');
  });

  it('does nothing on a form nobody has answered yet', () => {
    const form = harness();

    expect(form.address()).toBe('');
  });
});
