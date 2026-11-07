import { codeEmail, storePhrase } from '../email';

const base = {
  code: '482913',
  storeName: 'Acme Employee Store',
  benefitName: 'Employee Apparel Credit',
  expiresAt: Date.now() + 10 * 60 * 1000,
  resent: false,
  sender: 'Macaport',
};

describe('the code email', () => {
  it('puts the code in the subject so it reads from a notification', () => {
    expect(codeEmail(base).subject).toBe('482913 is your Macaport code');
  });

  it('says what it is for and when it dies', () => {
    const { text, html } = codeEmail(base);

    expect(text).toContain('482913');
    expect(text).toContain('Acme Employee Store');
    expect(text).toContain('Employee Apparel Credit');
    expect(text).toMatch(/expires in (9|10) minutes/);
    expect(html).toContain('482913');
  });

  it('explains a duplicate rather than leaving it looking like a fault', () => {
    expect(codeEmail({ ...base, resent: true }).text).toContain('same code');
    expect(codeEmail(base).text).toContain('ignore it');
  });

  it('escapes html in names', () => {
    const { html } = codeEmail({ ...base, storeName: 'A <b>&</b> Store' });

    expect(html).toContain('A &lt;b&gt;&amp;&lt;/b&gt; Store');
  });
});

describe('naming the store', () => {
  it('does not double the word when the name already ends in it', () => {
    expect(storePhrase('Lincoln Elementary Employee Store')).toBe(
      'Lincoln Elementary Employee Store'
    );
    expect(storePhrase('Parker Excavating Shop ')).toBe(
      'Parker Excavating Shop'
    );
    expect(
      codeEmail({ ...base, storeName: 'Acme Employee Store' }).text
    ).toContain('the Acme Employee Store is');
  });

  it('adds it when the name does not', () => {
    expect(storePhrase('New London Boys Basketball')).toBe(
      'New London Boys Basketball store'
    );
    // Not a suffix match on any word ending in "store".
    expect(storePhrase('Restore Hardware')).toBe('Restore Hardware store');
  });
});
