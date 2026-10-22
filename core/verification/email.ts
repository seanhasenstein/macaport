// The email that carries a sign-in code.
//
// The code is in the subject so it can be read from a notification without
// opening anything. Repeat sends carry the same subject and thread together
// in Gmail and Outlook, which is fine, because they also carry the same code:
// there is no wrong one to open. The body says so, so a duplicate does not
// look like a fault.

// "Acme store", but "Acme Employee Store" rather than "Acme Employee Store
// store". Client store names often already end in the word, and the doubled
// version is the thing that makes an email look generated.
export function storePhrase(storeName: string) {
  const name = storeName.trim();
  return /\b(store|shop)$/i.test(name) ? name : `${name} store`;
}

export interface CodeEmailInput {
  code: string;
  storeName: string;
  benefitName: string;
  // Unix milliseconds.
  expiresAt: number;
  resent: boolean;
  // Who to say it is from, e.g. "Macaport". A tenant name later.
  sender: string;
}

export function codeEmail(input: CodeEmailInput) {
  const minutes = Math.max(
    1,
    Math.round((input.expiresAt - Date.now()) / 60000)
  );
  const subject = `${input.code} is your ${input.sender} code`;

  const lines = [
    `Your code for the ${storePhrase(input.storeName)} is:`,
    '',
    input.code,
    '',
    `Enter it to activate your ${
      input.benefitName
    }. It expires in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
    '',
    'Never share this code. Macaport will never ask you for it.',
    input.resent
      ? 'You asked for this more than once. Every copy carries the same code, so any of them will work.'
      : 'If you did not ask for this, you can ignore it. Nothing happens without the code.',
  ];

  const text = lines.join('\n');

  const html = `<p>Your code for the ${escape(
    storePhrase(input.storeName)
  )} is:</p>
<p style="font-size:28px;font-weight:700;letter-spacing:0.2em;margin:16px 0">${escape(
    input.code
  )}</p>
<p>Enter it to activate your ${escape(
    input.benefitName
  )}. It expires in ${minutes} minute${minutes === 1 ? '' : 's'}.</p>
<p style="color:#6b7280;font-size:13px">${escape(lines[lines.length - 1])}</p>`;

  return { subject, text, html };
}

function escape(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
