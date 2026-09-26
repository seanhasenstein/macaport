import { codeEmail } from '../email';

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
