import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { AccessTokenState, LoginEdgeId, LoginNodeId, RefreshTokenState } from '@/features/Blog/posts/VideoSharing/widgets/loginFlow/types';

/** Failed logins allowed before the account is locked for a while. */
export const LOGIN_ATTEMPT_LIMIT = 5;
export const ACCESS_TOKEN_MINUTES = 15;
export const REFRESH_TOKEN_DAYS = 30;

export const LOGIN_NODES: Record<LoginNodeId, FlowNodeLayout> = {
  client: { x: 10, y: 134, label: 'Client', caption: 'app or browser' },
  lb: { x: 190, y: 134, label: 'Load balancer', caption: 'ends TLS' },
  accounts: { x: 370, y: 84, label: 'API: accounts', caption: 'login + refresh' },
  anyApi: { x: 370, y: 234, label: 'Any API server', caption: 'every other call' },
  userDb: { x: 590, y: 34, label: 'User DB', caption: 'password hashes' },
  tokenStore: { x: 590, y: 134, label: 'Token store', caption: 'Redis' },
};

export const LOGIN_EDGES: Record<LoginEdgeId, FlowEdgeLayout> = {
  'client-lb': { path: 'M122,160 H190' },
  'lb-accounts': { path: 'M302,150 C336,150 336,110 370,110' },
  'lb-anyApi': { path: 'M302,176 C336,176 336,260 370,260' },
  'accounts-userDb': { path: 'M482,100 C536,100 536,60 590,60' },
  'accounts-tokenStore': { path: 'M482,120 C536,120 536,160 590,160' },
};

export const LOGIN_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 126, y: 152, text: 'HTTPS' },
  { x: 500, y: 74, text: 'check hash' },
  { x: 496, y: 150, text: 'tokens, limits' },
  { x: 488, y: 252, text: 'no database call' },
];

export const ACCESS_TOKEN_LABELS: Record<AccessTokenState, string> = {
  none: 'None',
  valid: `Valid, ${ACCESS_TOKEN_MINUTES} min`,
  expired: 'Expired',
};

export const REFRESH_TOKEN_LABELS: Record<RefreshTokenState, string> = {
  none: 'None',
  valid: `Valid, ${REFRESH_TOKEN_DAYS} days`,
  rotated: 'Replaced by a new one',
  revoked: 'Revoked',
};
