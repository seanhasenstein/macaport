import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../../pages/contact';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.post('/api/send-message', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
beforeEach(() => render(<Contact />));
afterEach(() => server.resetHandlers());

const fakeFormData = {
  firstName: 'Sean',
  lastName: 'Hasenstein',
  email: 'sean@email.com',
  phone: '(123) 456-7890',
  message: 'This is my message.',
};

test('renders the correct form fields', async () => {
  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const phoneInput = screen.getByLabelText(/phone/i);
  const messageTextArea = screen.getByLabelText(/message/i);
  const honeypotInput = screen.getByLabelText(
    /please do not fill this field out/i
  );
  const submitButton = screen.getByRole('button', {
    name: /send your message/i,
  });

  expect(firstNameInput).toBeInTheDocument;
  expect(lastNameInput).toBeInTheDocument;
  expect(emailInput).toBeInTheDocument;
  expect(phoneInput).toBeInTheDocument;
  expect(messageTextArea).toBeInTheDocument;
  expect(honeypotInput).toBeInTheDocument;
  expect(submitButton).toBeInTheDocument;
});

test('renders input error validations after submit button is click', async () => {
  const submitButton = screen.getByRole('button', {
    name: /send your message/i,
  });

  await waitFor(() => userEvent.click(submitButton));

  expect(screen.getByText(/first name is required/i)).toBeInTheDocument;
  expect(screen.getByText(/last name is required/i)).toBeInTheDocument;
  expect(screen.getByText(/email address is required/i)).toBeInTheDocument;
  expect(screen.getByText(/phone number is required/i)).toBeInTheDocument;
  expect(screen.getByText(/message is required/i)).toBeInTheDocument;
});

test('renders validation message when invalid email is provided', async () => {
  const emailInput = screen.getByLabelText(/email/i);
  const phoneInput = screen.getByLabelText(/phone/i);

  await waitFor(() => userEvent.type(emailInput, 'invalid email'));
  await waitFor(() => userEvent.click(phoneInput));

  expect(screen.getByText(/a valid email is required/i)).toBeInTheDocument;
});

test('renders validation message when invalid phone number is provided', async () => {
  const phoneInput = screen.getByLabelText(/phone/i);
  const messageTextArea = screen.getByLabelText(/message/i);

  await waitFor(() => userEvent.type(phoneInput, '1234'));
  await waitFor(() => userEvent.click(messageTextArea));

  expect(screen.getByText(/phone number must be 10 digits/i)).toBeInTheDocument;
});

test('renders submit button disabled when the honeypot input is not empty', async () => {
  const honeypotInput = screen.getByLabelText(
    /please do not fill this field out/i
  );
  const submitButton = screen.getByRole('button', {
    name: /send your message/i,
  });

  await waitFor(() => userEvent.type(honeypotInput, 'hello'));

  expect(submitButton).toBeDisabled;
});

test('renders submit button not disabled when honeypot is empty', async () => {
  const submitButton = screen.getByRole('button', {
    name: /send your message/i,
  });

  expect(submitButton).not.toBeDisabled;
});

test('renders success component after form is submitted and we get a successful response from the server', async () => {
  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const phoneInput = screen.getByLabelText(/phone/i);
  const messageTextArea = screen.getByLabelText(/message/i);
  const submitButton = screen.getByRole('button', {
    name: /send your message/i,
  });

  await userEvent.type(firstNameInput, fakeFormData.firstName);
  await userEvent.type(lastNameInput, fakeFormData.lastName);
  await userEvent.type(emailInput, fakeFormData.email);
  await userEvent.type(phoneInput, fakeFormData.phone);
  await userEvent.type(messageTextArea, fakeFormData.message);
  await userEvent.click(submitButton);

  await waitForElementToBeRemoved(screen.queryByText(/loading/i));

  expect(
    screen.getByRole('heading', {
      name: /message sent!/i,
    })
  ).toBeInTheDocument;
});

test('renders error message after form is submitted and we get an error back from the server', async () => {
  server.use(
    rest.post('/api/send-message', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const phoneInput = screen.getByLabelText(/phone/i);
  const messageTextArea = screen.getByLabelText(/message/i);
  const submitButton = screen.getByRole('button', {
    name: /send your message/i,
  });

  await userEvent.type(firstNameInput, fakeFormData.firstName);
  await userEvent.type(lastNameInput, fakeFormData.lastName);
  await userEvent.type(emailInput, fakeFormData.email);
  await userEvent.type(phoneInput, fakeFormData.phone);
  await userEvent.type(messageTextArea, fakeFormData.message);
  await userEvent.click(submitButton);

  await waitForElementToBeRemoved(screen.queryByText(/loading/i));

  expect(screen.getByText(/internal server error/i)).toBeInTheDocument;
});
