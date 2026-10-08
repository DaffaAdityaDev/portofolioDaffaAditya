import type { FlowStep } from '@/features/Blog/flow/types';

export type LoginNodeId = 'client' | 'lb' | 'accounts' | 'anyApi' | 'userDb' | 'tokenStore';

export type LoginEdgeId = 'client-lb' | 'lb-accounts' | 'lb-anyApi' | 'accounts-userDb' | 'accounts-tokenStore';

export type LoginScenarioId = 'login' | 'refresh' | 'ban' | 'guessing';

/** What the client's access token is worth right now. */
export type AccessTokenState = 'none' | 'valid' | 'expired';

/** What the server thinks of the client's refresh token. */
export type RefreshTokenState = 'none' | 'valid' | 'rotated' | 'revoked';

export interface LoginStep extends FlowStep {
  activeNodes: LoginNodeId[];
  activeEdges: LoginEdgeId[];
  labels?: Partial<Record<LoginNodeId, string>>;
  access: AccessTokenState;
  refresh: RefreshTokenState;
  /** Failed logins counted for this account and IP. */
  failedAttempts: number;
}
