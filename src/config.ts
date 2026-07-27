// Single source of truth for contact details. Referenced by the hero CV link,
// the contact form, and the booking dialog, so switching the address (for
// example to cv@sjava.ai) is a one-line change here.

export const EMAIL = 'hello@sjava.ai';
export const LINKEDIN = 'https://www.linkedin.com/in/sarajavanmardi/';

/**
 * Cal.com booking. The v2 slots and bookings endpoints are unauthenticated and
 * CORS-open, so a static page can drive real bookings with no backend and no
 * secret to leak. Availability, duration and buffers all live in Cal.com, which
 * is the source of truth: this site only renders what the API returns.
 */
export const CAL = {
  username: 'sara-javanmardi',
  eventSlug: 'coffee',
  eventTypeId: 6459358,
  timeZone: 'America/Los_Angeles',
  tzLabel: 'PT',
  /** Each endpoint pins its own version; they are not the same date. */
  slotsApiVersion: '2024-09-04',
  bookingsApiVersion: '2024-08-13',
} as const;

type Compose = { to?: string; subject: string; body: string };

/**
 * Gmail's compose URL, used on desktop. A plain mailto: does nothing visible
 * there for anyone on webmail with no mail client registered, and the failure
 * is silent. This opens a pre-filled compose tab instead.
 *
 * Deliberately no `/u/0/` path segment: that pins Gmail to the first account a
 * visitor signed into, so anyone with a personal and a work account can end up
 * composing from the wrong one. Without it Gmail uses the active account, and
 * the From dropdown in the compose window covers the rest.
 *
 * The tradeoff: a visitor not signed into Google lands on a Gmail login. The
 * plain address stays printed in the contact section as the escape hatch.
 */

export const gmailCompose = ({ to = EMAIL, subject, body }: Compose) =>
  'https://mail.google.com/mail/?view=cm&fs=1' +
  `&to=${encodeURIComponent(to)}` +
  `&su=${encodeURIComponent(subject)}` +
  `&body=${encodeURIComponent(body)}`;

export const mailtoCompose = ({ to = EMAIL, subject, body }: Compose) =>
  `mailto:${to}` +
  `?subject=${encodeURIComponent(subject)}` +
  `&body=${encodeURIComponent(body)}`;

/**
 * Phones and tablets always have a default mail app registered, so mailto:
 * hands off natively and lands in whatever they actually use, usually the
 * Gmail app. Gmail's web compose is the reverse: fine on desktop, but on a
 * phone it typically redirects to the inbox and drops the draft.
 *
 * Deliberately not the googlegmail:// deep link. That forces the Gmail app
 * specifically, but does nothing at all when it is not installed, which is the
 * silent failure we moved off mailto: to avoid in the first place.
 *
 * Primary pointer, not screen width: a touchscreen laptop still reports `fine`
 * because its main input is a trackpad, so it correctly gets the desktop path.
 */
export const isTouchPrimary = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: coarse)').matches;

/** Gmail web on desktop, the native mail app on touch devices. */
export const composeUrl = (args: Compose) =>
  isTouchPrimary() ? mailtoCompose(args) : gmailCompose(args);

/** Subject and body for the CV request, shared by the link and its rewrite. */
export const CV_REQUEST: Compose = {
  subject: 'Resume request',
  body: [
    'Hi Sara,',
    '',
    'I would like to receive a copy of your resume.',
    '',
    'Thanks,',
    // No email placeholder: they are sending from their own account, so the
    // From header already carries it. Phone is the only contact detail the
    // message would not otherwise include.
    '[Name]',
    '[Phone]',
  ].join('\n'),
};

/**
 * Server-rendered href for the `cv` link, so it works before JS and without
 * it. A client script swaps it for the mailto form on touch devices.
 */
export const CV_COMPOSE = gmailCompose(CV_REQUEST);
