import type { FlowScenario } from '@/features/Blog/flow/types';
import type { LoginScenarioId, LoginStep } from './types';
import { ACCESS_TOKEN_MINUTES, LOGIN_ATTEMPT_LIMIT, REFRESH_TOKEN_DAYS } from './constants';

const SEND_CREDENTIALS: LoginStep = {
  id: 'send-credentials',
  title: 'Send the credentials',
  detail:
    'The client sends the email and password over HTTPS. The load balancer ends TLS and routes /auth/* to the accounts module. Login is the only request that ever carries a password.',
  activeNodes: ['client', 'lb', 'accounts'],
  activeEdges: ['client-lb', 'lb-accounts'],
  access: 'none',
  refresh: 'none',
  failedAttempts: 0,
  labels: { accounts: 'POST /auth/login' },
};

const CHECK_LIMIT: LoginStep = {
  id: 'check-limit',
  title: 'Check the rate limit first',
  detail: `Before any expensive work, the accounts module asks the token store how many logins failed for this account and this IP in the last minutes. Under ${LOGIN_ATTEMPT_LIMIT}, it goes on.`,
  activeNodes: ['accounts', 'tokenStore'],
  activeEdges: ['accounts-tokenStore'],
  access: 'none',
  refresh: 'none',
  failedAttempts: 0,
  labels: { tokenStore: `0 of ${LOGIN_ATTEMPT_LIMIT} failed` },
};

const ISSUE_TOKENS: LoginStep = {
  id: 'issue-tokens',
  title: 'Issue two tokens',
  detail: `The module signs an access token that lives ${ACCESS_TOKEN_MINUTES} minutes and holds the user ID and roles. It also creates a refresh token that lives ${REFRESH_TOKEN_DAYS} days and stores only its hash in the token store, so a leak of the store does not leak usable tokens. Both go back to the client.`,
  activeNodes: ['client', 'lb', 'accounts', 'tokenStore'],
  activeEdges: ['client-lb', 'lb-accounts', 'accounts-tokenStore'],
  access: 'valid',
  refresh: 'valid',
  failedAttempts: 0,
  labels: { tokenStore: 'refresh saved', client: 'holds 2 tokens' },
};

const USE_ACCESS_TOKEN: LoginStep = {
  id: 'use-access-token',
  title: 'Every other request: checked locally',
  detail:
    'From now on the client sends the access token with every request. Whichever API server receives it checks the signature with the public key it already holds, and the expiry time. No database, no cache, no call to the accounts module. That is what keeps the API servers stateless, so more of them can be added at any time.',
  activeNodes: ['client', 'lb', 'anyApi'],
  activeEdges: ['client-lb', 'lb-anyApi'],
  access: 'valid',
  refresh: 'valid',
  failedAttempts: 0,
  labels: { anyApi: 'signature ok' },
};

export const LOGIN_SCENARIOS: Record<LoginScenarioId, FlowScenario<LoginStep>> = {
  login: {
    id: 'login',
    label: 'Log in',
    summary: 'A password goes in once, two tokens come out, and every request after that costs no database call.',
    steps: [
      SEND_CREDENTIALS,
      CHECK_LIMIT,
      {
        id: 'verify-password',
        title: 'Compare the password with its hash',
        detail:
          'The module reads the user and compares the password with the stored hash. bcrypt or Argon2 is slow on purpose, about 100 ms per try, which is nothing for one login and a wall for someone trying millions. This is why login has its own rate limit and can be scaled apart from the rest.',
        activeNodes: ['accounts', 'userDb'],
        activeEdges: ['accounts-userDb'],
        access: 'none',
        refresh: 'none',
        failedAttempts: 0,
        labels: { userDb: 'hash matches' },
      },
      ISSUE_TOKENS,
      USE_ACCESS_TOKEN,
    ],
  },
  refresh: {
    id: 'refresh',
    label: 'Token expires',
    summary: 'The short token runs out, and the long one quietly gets a new pair without asking for the password.',
    steps: [
      USE_ACCESS_TOKEN,
      {
        id: 'expired',
        title: 'The access token runs out',
        detail: `After ${ACCESS_TOKEN_MINUTES} minutes the expiry time has passed. The API server sees it during the same local check and answers 401. Still no database call.`,
        activeNodes: ['client', 'lb', 'anyApi'],
        activeEdges: ['client-lb', 'lb-anyApi'],
        access: 'expired',
        refresh: 'valid',
        failedAttempts: 0,
        labels: { anyApi: '401 expired' },
      },
      {
        id: 'send-refresh',
        title: 'Trade the refresh token',
        detail:
          'The client sends its refresh token to /auth/refresh. The accounts module looks up its hash in the token store. It exists and is not revoked, so the session is still allowed.',
        activeNodes: ['client', 'lb', 'accounts', 'tokenStore'],
        activeEdges: ['client-lb', 'lb-accounts', 'accounts-tokenStore'],
        access: 'expired',
        refresh: 'valid',
        failedAttempts: 0,
        labels: { accounts: 'POST /auth/refresh', tokenStore: 'found' },
      },
      {
        id: 'rotate',
        title: 'Rotate: a new pair, the old one dies',
        detail:
          'The module issues a new access token and a new refresh token, and marks the old refresh token as used. If that old one ever shows up again, someone copied it, so the module revokes the whole chain and the user has to log in again. This is called refresh token rotation.',
        activeNodes: ['client', 'lb', 'accounts', 'tokenStore'],
        activeEdges: ['client-lb', 'lb-accounts', 'accounts-tokenStore'],
        access: 'valid',
        refresh: 'rotated',
        failedAttempts: 0,
        tone: 'recovery',
        labels: { tokenStore: 'old one used up' },
      },
      { ...USE_ACCESS_TOKEN, id: 'continue', title: 'Carry on, still no password', refresh: 'rotated' },
    ],
  },
  ban: {
    id: 'ban',
    label: 'Account banned',
    summary: 'Revoking is instant for the long token, but the short one keeps working until it expires.',
    steps: [
      USE_ACCESS_TOKEN,
      {
        id: 'ban',
        title: 'A moderator bans the account',
        detail:
          'The accounts module marks the user as banned in the user database and deletes every refresh token of that user from the token store.',
        activeNodes: ['accounts', 'userDb', 'tokenStore'],
        activeEdges: ['accounts-userDb', 'accounts-tokenStore'],
        access: 'valid',
        refresh: 'revoked',
        failedAttempts: 0,
        labels: { userDb: 'banned', tokenStore: 'tokens deleted' },
      },
      {
        id: 'still-valid',
        title: 'The access token still works',
        detail: `The API servers never ask the database, so they cannot know about the ban. The signed access token stays valid for up to ${ACCESS_TOKEN_MINUTES} minutes. This is the price of checking tokens locally, and the short lifetime is what keeps it small. Where minutes are too long, the servers can also keep a small deny-list of banned user IDs in memory, pushed to them the same way as the edge reports.`,
        activeNodes: ['client', 'lb', 'anyApi'],
        activeEdges: ['client-lb', 'lb-anyApi'],
        access: 'valid',
        refresh: 'revoked',
        failedAttempts: 0,
        tone: 'error',
        labels: { anyApi: 'still accepted' },
      },
      {
        id: 'refresh-refused',
        title: 'The next refresh is refused',
        detail:
          'When the access token expires, the client tries to refresh. The refresh token is gone from the store, so the module answers 401 and the session is over for good.',
        activeNodes: ['client', 'lb', 'accounts', 'tokenStore'],
        activeEdges: ['client-lb', 'lb-accounts', 'accounts-tokenStore'],
        access: 'expired',
        refresh: 'revoked',
        failedAttempts: 0,
        tone: 'recovery',
        labels: { tokenStore: 'not found', accounts: '401, log in' },
      },
    ],
  },
  guessing: {
    id: 'guessing',
    label: 'Password guessing',
    summary: 'A bot tries password after password. The limit stops it before the expensive hash even runs.',
    steps: [
      {
        ...SEND_CREDENTIALS,
        id: 'wrong-password',
        title: 'Wrong password',
        detail:
          'The hash does not match. The module answers "wrong email or password", the same message whether the email exists or not, so the answer tells an attacker nothing. The failure is counted in the token store.',
        activeNodes: ['client', 'lb', 'accounts', 'userDb', 'tokenStore'],
        activeEdges: ['client-lb', 'lb-accounts', 'accounts-userDb', 'accounts-tokenStore'],
        failedAttempts: 1,
        labels: { userDb: 'no match', tokenStore: `1 of ${LOGIN_ATTEMPT_LIMIT} failed` },
      },
      {
        ...SEND_CREDENTIALS,
        id: 'more-guesses',
        title: 'Guess after guess',
        detail:
          'Each failure adds to the count and makes the next answer wait a little longer. The limit is kept per account and per IP, so spreading guesses over many accounts from one IP is caught too.',
        activeNodes: ['client', 'lb', 'accounts', 'userDb', 'tokenStore'],
        activeEdges: ['client-lb', 'lb-accounts', 'accounts-userDb', 'accounts-tokenStore'],
        failedAttempts: LOGIN_ATTEMPT_LIMIT,
        tone: 'error',
        labels: { userDb: 'no match', tokenStore: `${LOGIN_ATTEMPT_LIMIT} of ${LOGIN_ATTEMPT_LIMIT} failed` },
      },
      {
        ...SEND_CREDENTIALS,
        id: 'locked',
        title: 'Locked before the hash runs',
        detail:
          'The next attempt stops at the rate-limit check. The module answers 429 and asks for a CAPTCHA, or locks the account for 15 minutes. The slow hash never runs, so the bot cannot burn the servers\' CPU either. The real owner can still log in after the lock, or by solving the CAPTCHA.',
        activeNodes: ['client', 'lb', 'accounts', 'tokenStore'],
        activeEdges: ['client-lb', 'lb-accounts', 'accounts-tokenStore'],
        failedAttempts: LOGIN_ATTEMPT_LIMIT,
        tone: 'recovery',
        labels: { accounts: '429, CAPTCHA', tokenStore: 'locked 15 min' },
      },
    ],
  },
};

export const LOGIN_SCENARIO_ORDER: LoginScenarioId[] = ['login', 'refresh', 'ban', 'guessing'];
