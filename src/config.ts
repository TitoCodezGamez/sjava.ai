// Single source of truth for contact details. Referenced by the hero CV link,
// the contact form, and the booking dialog, so switching the address (for
// example to cv@sjava.ai) is a one-line change here.

export const EMAIL = 'hello@sjava.ai';
export const LINKEDIN = 'https://www.linkedin.com/in/sarajavanmardi/';

/**
 * The `cv` link does not point at a hosted file. It opens a pre-written
 * request addressed to Sara, so she stays in control of who receives the
 * resume and has the requester's details when she replies.
 */
const CV_SUBJECT = 'Resume request';
const CV_BODY = [
  'Hi Sara,',
  '',
  'I would like to receive a copy of your resume.',
  '',
  'Thanks,',
  '[Your name]',
  '[Your phone]',
  '[Your email]',
].join('\n');

export const CV_MAILTO =
  `mailto:${EMAIL}` +
  `?subject=${encodeURIComponent(CV_SUBJECT)}` +
  `&body=${encodeURIComponent(CV_BODY)}`;
