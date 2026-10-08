import type { FlowScenario, StepTone } from '@/features/Blog/flow/types';
import type {
  DeployEdgeId,
  DeployNodeId,
  DeployScenarioId,
  DeployStep,
} from '@/features/Blog/posts/VideoSharing/widgets/deployPipeline/types';

const step = (
  id: string,
  title: string,
  detail: string,
  activeNodes: DeployNodeId[],
  activeEdges: DeployEdgeId[],
  labels?: Partial<Record<DeployNodeId, string>>,
  tone?: StepTone,
): DeployStep => ({ id, title, detail, activeNodes, activeEdges, labels, tone });

const PUSH = step(
  'push',
  'Merge and test',
  'A change to the API is merged to main. CI runs the tests, builds a container image, and tags it with the commit: api:3f9c2e1. Nothing about production has changed yet.',
  ['dev', 'ci'],
  ['dev-ci'],
  { ci: 'tests pass' },
);

const PUBLISH = step(
  'publish',
  'Publish the image',
  'The image goes to the registry. The same image is used in every environment and is never rebuilt, so what was tested is exactly what runs. Old images stay, which is what makes a rollback fast.',
  ['ci', 'registry'],
  ['ci-registry'],
  { registry: 'api:3f9c2e1' },
);

const SYNC = step(
  'sync',
  'Change the desired state',
  'CI does not touch the cluster. It commits the new image tag to the config repository. Argo CD, running inside the cluster, notices that git and the cluster differ and starts to close the gap. Git is the single record of what should run.',
  ['ci', 'argo'],
  ['ci-argo'],
  { argo: 'git says v42' },
);

const CANARY = step(
  'canary',
  'Start a canary',
  'A few pods start on the new version and pull the image. The balancer sends them 5% of the traffic. The old pods keep serving the other 95%. Database changes went out earlier, and only ones the old version can live with.',
  ['argo', 'canary', 'registry'],
  ['argo-canary', 'registry-canary'],
  { canary: 'v42, 5%', stable: 'v41, 95%' },
);

export const DEPLOY_SCENARIOS: Record<DeployScenarioId, FlowScenario<DeployStep>> = {
  success: {
    id: 'success',
    label: 'Good release',
    summary: 'From merge to 100% of traffic, with the new version proving itself on a small slice first.',
    steps: [
      PUSH,
      PUBLISH,
      SYNC,
      CANARY,
      step(
        'watch',
        'Compare with the old version',
        'For ten minutes the canary\'s error rate and slow-request latency are compared with the stable pods, on the same traffic at the same time. Comparing with the stable pods, not with yesterday, rules out a busy evening being mistaken for a bad release.',
        ['canary', 'metrics', 'argo'],
        ['canary-metrics', 'metrics-argo'],
        { metrics: 'same as stable' },
      ),
      step(
        'promote',
        'Promote step by step',
        'The canary passes, so the traffic moves to 25%, 50% and 100%, with a check at each step. Each old pod leaves the balancer first, finishes the requests it holds, and only then shuts down. Nobody sees a cut connection.',
        ['argo', 'stable', 'registry'],
        ['argo-stable', 'registry-stable'],
        { stable: 'v42, 100%', canary: 'none' },
        'recovery',
      ),
    ],
  },
  ciFail: {
    id: 'ciFail',
    label: 'Tests fail',
    summary: 'A broken change is stopped before it becomes an image. Production never hears of it.',
    steps: [
      step(
        'push',
        'Merge and test',
        'A change is merged to main and CI starts the tests.',
        ['dev', 'ci'],
        ['dev-ci'],
        { ci: 'running tests' },
      ),
      step(
        'fail',
        'A test fails',
        'One test fails. The pipeline stops there: no image is built, nothing reaches the registry, and the config repository is not touched. The cluster keeps running v41.',
        ['ci'],
        [],
        { ci: '1 test failed' },
        'error',
      ),
      step(
        'fix',
        'Fix and try again',
        'The developer gets the failure in minutes, fixes it, and merges again. A failure this early is the cheapest kind there is.',
        ['dev', 'ci'],
        ['dev-ci'],
        { ci: 'tests pass' },
        'recovery',
      ),
    ],
  },
  badCanary: {
    id: 'badCanary',
    label: 'Bad canary',
    summary: 'The tests passed, but the new version fails on real traffic. The rollout stops itself.',
    steps: [
      PUSH,
      PUBLISH,
      SYNC,
      CANARY,
      step(
        'errors',
        'Errors on the canary',
        'Real traffic finds what the tests missed: the canary fails 4% of its requests, against 0.1% on the stable pods.',
        ['canary', 'metrics'],
        ['canary-metrics'],
        { canary: 'v42 failing', metrics: '4% vs 0.1%' },
        'error',
      ),
      step(
        'abort',
        'Abort on its own',
        'The comparison fails, so the rollout aborts without waiting for a person: traffic to the canary drops to 0% and its pods are removed. Only 5% of requests, for a few minutes, were hurt.',
        ['metrics', 'argo', 'canary'],
        ['metrics-argo', 'argo-canary'],
        { argo: 'abort', canary: 'none', stable: 'v41, 100%' },
        'recovery',
      ),
      step(
        'revert',
        'Make git agree',
        'The bad commit is reverted in git, so the desired state says v41 again and the next sync does not retry the bad version.',
        ['dev', 'ci', 'argo'],
        ['dev-ci', 'ci-argo'],
        { argo: 'git says v41' },
        'recovery',
      ),
    ],
  },
  rollback: {
    id: 'rollback',
    label: 'Bug found later',
    summary: 'Some problems only show after hours at full traffic. Rolling back is a git revert and an old image.',
    steps: [
      step(
        'leak',
        'A slow problem',
        'v42 passed its canary and has run at 100% for two hours. Now its memory keeps growing, and pods restart every twenty minutes. The canary was too short to see it.',
        ['stable', 'metrics'],
        [],
        { stable: 'v42 leaking', metrics: 'memory rising' },
        'error',
      ),
      step(
        'roll',
        'Roll back',
        'Someone reverts the image tag in the config repository. Argo CD syncs, and the pods are replaced with v41, whose image is still in the registry. Nothing is rebuilt, so the rollback takes minutes, and it uses the same rolling, draining path as any deploy.',
        ['ci', 'argo', 'stable', 'registry'],
        ['ci-argo', 'argo-stable', 'registry-stable'],
        { argo: 'git says v41', stable: 'v41, 100%' },
        'recovery',
      ),
      step(
        'schema',
        'Why the database did not block it',
        'v41 can still read the database because schema changes are split in two: first add the new column and ship code that uses it, and drop the old one only after the release has proven itself. Rolling back the code never needs rolling back the schema.',
        ['stable'],
        [],
        { stable: 'v41, new schema' },
      ),
    ],
  },
  argoDown: {
    id: 'argoDown',
    label: 'Deploy tool down',
    summary: 'The deploy machinery breaks. Running traffic does not care.',
    steps: [
      step(
        'down',
        'Argo CD is down',
        'The node running Argo CD fails. New releases cannot be rolled out.',
        ['argo'],
        [],
        { argo: 'down' },
        'error',
      ),
      step(
        'serving',
        'Production keeps serving',
        'The pods do not depend on the deploy tool to run. They keep serving viewers on the current version, and only releases wait. When Argo CD comes back, it reads git and catches up on its own. The same holds for CI and the registry: they sit beside the request path, never on it.',
        ['stable'],
        [],
        { stable: 'v41, serving' },
        'recovery',
      ),
    ],
  },
};

export const DEPLOY_SCENARIO_ORDER: DeployScenarioId[] = ['success', 'ciFail', 'badCanary', 'rollback', 'argoDown'];
