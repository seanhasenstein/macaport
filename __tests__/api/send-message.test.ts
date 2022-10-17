import { NextApiRequest, NextApiResponse } from 'next';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ContactFormValues } from 'interfaces';
import sendMessage from '../../pages/api/send-message';

interface Request extends NextApiRequest {
  body: ContactFormValues;
}

const server = setupServer(
  rest.post(
    `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ success: true }));
    }
  )
);

test('sends a {success: true} after a successful post request to the MailGun API', async () => {
  server.listen();

  const req = {
    body: {
      firstName: 'Sean',
      lastName: 'Hasenstein',
      email: 'test@email.com',
      phone: '1234567890',
      honeypot: '',
      message: 'This is a test message.',
    },
  } as unknown as Request;
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as unknown as NextApiResponse;

  await sendMessage(req, res);

  expect(json.mock.calls[0][0].success).toBe(true);
});

test('sends an error message after a failed request to the MailGun API', async () => {
  server.use(
    rest.post(
      `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
      (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Internal server error' })
        );
      }
    )
  );
  server.listen();

  const req = {
    body: {
      firstName: 'Sean',
      lastName: 'Hasenstein',
      email: 'test@email.com',
      phone: '1234567890',
      honeypot: '',
      message: 'This is a test message.',
    },
  } as unknown as Request;
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as unknown as NextApiResponse;

  await sendMessage(req, res);

  expect(json.mock.calls[0][0].error).toBe('Internal server error');
});
