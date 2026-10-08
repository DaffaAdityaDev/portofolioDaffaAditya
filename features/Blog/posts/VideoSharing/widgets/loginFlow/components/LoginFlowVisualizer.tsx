import React from 'react';
import { KeyRound } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { LOGIN_FLOW } from '../flow';
import LoginTokenPanel from './LoginTokenPanel';

/**
 * Step-by-step picture of logging in: the password check, the two tokens,
 * local token checks, and what happens on expiry, a ban or password guessing.
 */
const LoginFlowVisualizer: React.FC = () => (
  <FlowShell flow={LOGIN_FLOW} title="Login flow" icon={KeyRound}>
    <LoginTokenPanel />
  </FlowShell>
);

export default LoginFlowVisualizer;
