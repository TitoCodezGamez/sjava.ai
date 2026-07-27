// Single source of truth for contact details. Referenced by the hero CV link,
// the contact form, and the booking dialog, so switching the address (for
// example to cv@sjava.ai) is a one-line change here.

export const EMAIL = 'hello@sjava.ai';
export const LINKEDIN = 'https://www.linkedin.com/in/sarajavanmardi/';

/**
 * Gmail's compose URL rather than `mailto:`. A mailto does nothing visible for
 * anyone on webmail with no desktop client registered, which is most people,
 * and the failure is silent. This opens a pre-filled compose tab instead.
 *
 * Deliberately no `/u/0/` path segment: that pins Gmail to the first account a
 * visitor signed into, so anyone with a personal and a work account can end up
 * composing from the wrong one. Without it Gmail uses the active account, and
 * the From dropdown in the compose window covers the rest.
 *
 * The tradeoff: a visitor not signed into Google lands on a Gmail login. The
 * plain address stays printed in the contact section as the escape hatch.
 */
export const gmailCompose = ({
  to = EMAIL,
  subject,
  body,
}: {
  to?: string;
  subject: string;
  body: string;
}) =>
  'https://mail.google.com/mail/?view=cm&fs=1' +
  `&to=${encodeURIComponent(to)}` +
  `&su=${encodeURIComponent(subject)}` +
  `&body=${encodeURIComponent(body)}`;

/**
 * The `cv` link does not point at a hosted file. It opens a pre-written
 * request addressed to Sara, so she stays in control of who receives the
 * resume and has the requester's details when she replies.
 */
export const CV_COMPOSE = gmailCompose({
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
});
