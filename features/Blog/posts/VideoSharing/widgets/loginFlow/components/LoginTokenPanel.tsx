import React from 'react';
import { cn } from '@/utils/cn';
import type { AccessTokenState, RefreshTokenState } from '../types';
import { WIDGET_BADGE_CLASS, WIDGET_BADGE_IDLE_CLASS, WIDGET_LABEL_CLASS } from '@/features/Blog/components/widgetStyles';
import { useFlow } from '@/features/Blog/flow/hooks/useFlow';
import { ACCESS_TOKEN_LABELS, LOGIN_ATTEMPT_LIMIT, REFRESH_TOKEN_LABELS } from '../constants';
import { LOGIN_FLOW } from '../flow';

const METER_LABEL_CLASS = cn('mb-1', WIDGET_LABEL_CLASS);

const ACCESS_CLASS: Record<AccessTokenState, string> = {
  none: WIDGET_BADGE_IDLE_CLASS,
  valid: 'border-emerald-400 text-emerald-400',
  expired: 'border-amber-400 text-amber-400',
};

const REFRESH_CLASS: Record<RefreshTokenState, string> = {
  none: WIDGET_BADGE_IDLE_CLASS,
  valid: 'border-emerald-400 text-emerald-400',
  rotated: 'border-sky-400 text-sky-400',
  revoked: 'border-red-500 text-red-500',
};

const TokenBadge: React.FC<{ label: string; text: string; className: string }> = ({ label, text, className }) => (
  <div>
    <div className={METER_LABEL_CLASS}>{label}</div>
    <span className={cn(WIDGET_BADGE_CLASS, className)}>{text}</span>
  </div>
);

/** Failed logins so far, one cell per allowed attempt. Red once the limit is reached. */
const AttemptMeter: React.FC<{ failed: number }> = ({ failed }) => {
  const isLocked = failed >= LOGIN_ATTEMPT_LIMIT;
  return (
    <div>
      <div className={cn(METER_LABEL_CLASS, 'flex justify-between')}>
        <span>Failed logins</span>
        <span className={isLocked ? 'text-red-500' : undefined}>
          {failed} of {LOGIN_ATTEMPT_LIMIT}
        </span>
      </div>
      <div className="flex gap-1" role="img" aria-label={`Failed logins: ${failed} of ${LOGIN_ATTEMPT_LIMIT}`}>
        {Array.from({ length: LOGIN_ATTEMPT_LIMIT }, (_, index) => (
          <div
            key={index}
            className={cn(
              'h-5 flex-1 border transition-colors duration-300',
              index < failed ? (isLocked ? 'border-red-500 bg-red-500/60' : 'border-amber-400 bg-amber-400/40') : 'border-border',
            )}
          />
        ))}
      </div>
    </div>
  );
};

/** The client's two tokens and the failed-login count for the current step. */
const LoginTokenPanel: React.FC = () => {
  const { step } = useFlow(LOGIN_FLOW);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <TokenBadge label="Access token" text={ACCESS_TOKEN_LABELS[step.access]} className={ACCESS_CLASS[step.access]} />
      <TokenBadge label="Refresh token" text={REFRESH_TOKEN_LABELS[step.refresh]} className={REFRESH_CLASS[step.refresh]} />
      <AttemptMeter failed={step.failedAttempts} />
    </div>
  );
};

export default LoginTokenPanel;
