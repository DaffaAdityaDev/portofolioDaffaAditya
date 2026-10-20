import type { FlowScenario, StepTone } from '@/features/Blog/flow/types';
import type { LbEdgeId, LbNodeId, LbScenarioId, LbStep } from './types';

const step = (
  id: string,
  title: string,
  detail: string,
  activeNodes: LbNodeId[],
  activeEdges: LbEdgeId[],
  labels?: Partial<Record<LbNodeId, string>>,
  tone?: StepTone,
): LbStep => ({ id, title, detail, activeNodes, activeEdges, labels, tone });

export const LB_SCENARIOS: Record<LbScenarioId, FlowScenario<LbStep>> = {
  route: {
    id: 'route',
    label: 'Routing a request',
    summary: 'A layer-7 balancer reads each request and picks a fleet, then a server inside it.',
    steps: [
      step(
        'connect',
        'Connect and end TLS',
        'The app opens a connection to api.example.com and lands on balancer A. The balancer ends TLS here, so it can read the request, and the servers behind it never deal with certificates.',
        ['clients', 'lbA'],
        ['clients-lbA'],
        { lbA: 'TLS ends here' },
      ),
      step(
        'api',
        'Route by path',
        'GET /api/videos/42 matches the /api/* rule, so it goes to the API fleet. Inside the fleet the balancer picks the server with the fewest requests in progress: server 2.',
        ['clients', 'lbA', 'api2'],
        ['clients-lbA', 'lbA-api2'],
        { lbA: '/api/* to API', api2: 'GET /videos/42' },
      ),
      step(
        'next',
        'The next request, another server',
        'The next request from the same viewer may go to server 1. That is fine, because no server keeps a session: the signed login token travels with every request, and any server can check it.',
        ['clients', 'lbA', 'api1'],
        ['clients-lbA', 'lbA-api1'],
        { api1: 'same viewer, ok' },
      ),
      step(
        'upload',
        'Route by host',
        'A request for upload.example.com goes to the upload service instead, a separate fleet with long timeouts for big chunks. A burst of uploads can never take capacity from the servers that answer viewers.',
        ['clients', 'lbA', 'upload'],
        ['clients-lbA', 'lbA-upload'],
        { lbA: 'host: upload.*', upload: 'chunk 7 of 40' },
      ),
    ],
  },
  health: {
    id: 'health',
    label: 'A server gets sick',
    summary: 'Health checks take a broken server out of rotation, and put it back once it recovers.',
    steps: [
      step(
        'checks',
        'Check every few seconds',
        'Every 5 seconds the balancer calls /health on every server. The check answers only "is this process alive and able to serve". It never calls the database or the cache.',
        ['lbA', 'api1', 'api2', 'api3'],
        ['lbA-api1', 'lbA-api2', 'lbA-api3'],
        { lbA: 'GET /health' },
      ),
      step(
        'fail',
        'Server 3 stops answering',
        'Server 3 runs out of memory and its checks time out. One failed check could be a blip, so the balancer waits for three in a row: about 15 seconds.',
        ['lbA', 'api3'],
        ['lbA-api3'],
        { api3: 'failing /health' },
        'error',
      ),
      step(
        'out',
        'Out of rotation',
        'After the third failure, server 3 gets no new requests. Servers 1 and 2 take its share. Viewers notice nothing, because the fleet always runs with room to spare for exactly this.',
        ['clients', 'lbA', 'api1', 'api2'],
        ['clients-lbA', 'lbA-api1', 'lbA-api2'],
        { api3: 'out of rotation' },
        'recovery',
      ),
      step(
        'back',
        'Back in, slowly',
        'Kubernetes restarts the process. Once it passes two checks in a row, the balancer sends it traffic again, ramping up over half a minute so a cold server is not flooded at once.',
        ['lbA', 'api3'],
        ['lbA-api3'],
        { api3: 'warming up' },
        'recovery',
      ),
      step(
        'why',
        'Why the check skips the database',
        'If /health also checked the database, one slow database would make every server fail its check at the same moment. The balancer would take the whole fleet out, and a slow database would become a full outage.',
        ['api1', 'api2', 'api3'],
        [],
        { api1: 'would fail', api2: 'would fail', api3: 'would fail' },
        'error',
      ),
    ],
  },
  lbDown: {
    id: 'lbDown',
    label: 'A balancer goes down',
    summary: 'The balancer is a fleet too. When one copy dies, the network sends its clients to the other.',
    steps: [
      step(
        'both',
        'Two copies, one address',
        'Both balancers announce the same IP address (anycast), and internet routing sends each client to one of them. Each one carries about half the traffic and can reach every server.',
        ['clients', 'lbA', 'lbB', 'api2', 'api3'],
        ['clients-lbA', 'clients-lbB', 'lbA-api2', 'lbB-api3'],
      ),
      step(
        'dies',
        'Balancer A dies',
        'The machine behind balancer A fails. Connections that were open through it are cut, and the apps see a network error.',
        ['clients', 'lbA'],
        ['clients-lbA'],
        { lbA: 'down' },
        'error',
      ),
      step(
        'reroute',
        'The route disappears',
        'Balancer A no longer announces the address, so within seconds routing sends every client to balancer B. The apps retry, reconnect, and carry on. Nobody changed a DNS record.',
        ['clients', 'lbB', 'api1', 'api2', 'api3', 'upload'],
        ['clients-lbB', 'lbB-api1', 'lbB-api2', 'lbB-api3', 'lbB-upload'],
        { lbB: 'all traffic' },
        'recovery',
      ),
      step(
        'headroom',
        'The rule that made it work',
        'Balancer B could take everything only because each balancer normally runs below half its capacity. Two copies that are each 70% busy are not a backup: when one dies, the other drowns.',
        ['lbB'],
        [],
        { lbB: 'under half load' },
      ),
    ],
  },
};

export const LB_SCENARIO_ORDER: LbScenarioId[] = ['route', 'health', 'lbDown'];
