import type { FlowScenario, StepTone } from '@/features/Blog/flow/types';
import type {
  CountEdgeId,
  CountNodeId,
  CountScenarioId,
  CountStep,
} from '@/features/Blog/posts/VideoSharing/widgets/viewCount/types';

const step = (
  id: string,
  title: string,
  detail: string,
  fields: {
    nodes: CountNodeId[];
    edges: CountEdgeId[];
    events: number;
    counted: number;
    dbWrites: number;
    labels?: Partial<Record<CountNodeId, string>>;
    tone?: StepTone;
  },
): CountStep => ({
  id,
  title,
  detail,
  activeNodes: fields.nodes,
  activeEdges: fields.edges,
  labels: fields.labels,
  tone: fields.tone,
  events: fields.events,
  counted: fields.counted,
  dbWrites: fields.dbWrites,
});

const WATCH = step(
  'watch',
  'Watch long enough',
  'A viewer watches v_42 for 30 seconds. Only then does the player send a view event. Someone who leaves after two seconds is not a view.',
  { nodes: ['player', 'api'], edges: ['player-api'], events: 0, counted: 0, dbWrites: 0, labels: { player: 'watched 30 s' } },
);

const ACCEPT = step(
  'accept',
  'The API only accepts',
  'The API checks the login token and the rate limits, appends the event to the stream and answers at once. It writes no counter. 23,000 views a second never turn into 23,000 database writes a second.',
  { nodes: ['api', 'stream'], edges: ['api-stream'], events: 1, counted: 0, dbWrites: 0, labels: { api: '202 accepted' } },
);

const COUNT = step(
  'count',
  'Count once per viewer',
  'The aggregator reads the event and asks Redis whether this viewer was already counted for v_42 in the last few hours. They were not, so it records them in that set, with an expiry, and adds one to its total for v_42 in memory.',
  {
    nodes: ['stream', 'aggregator', 'redis'],
    edges: ['stream-aggregator', 'aggregator-redis'],
    events: 1,
    counted: 1,
    dbWrites: 0,
    labels: { aggregator: 'v_42: +1', redis: 'not seen: add' },
  },
);

export const COUNT_SCENARIOS: Record<CountScenarioId, FlowScenario<CountStep>> = {
  view: {
    id: 'view',
    label: 'Counting a view',
    summary: 'One view, from the player to the counter on the video, without a database write per view.',
    steps: [
      WATCH,
      ACCEPT,
      COUNT,
      step(
        'flush',
        'Flush a batch',
        'Every ten seconds the aggregator writes what it has collected: one UPDATE that adds 1,240 views to v_42, and the same number to the counter in Redis that the watch page reads. 1,240 views, one write.',
        {
          nodes: ['aggregator', 'db', 'redis'],
          edges: ['aggregator-db', 'aggregator-redis'],
          events: 1240,
          counted: 1240,
          dbWrites: 1,
          labels: { db: 'views + 1,240', redis: 'views + 1,240' },
          tone: 'recovery',
        },
      ),
    ],
  },
  rewatch: {
    id: 'rewatch',
    label: 'Same viewer, 20 times',
    summary: 'One viewer refreshes the page twenty times. The count goes up by one.',
    steps: [
      step(
        'refresh',
        'Twenty plays',
        'A fan reloads the video twenty times in an hour, watching 30 seconds each time. The player sends twenty view events, and the API accepts all of them: each one is a normal request.',
        {
          nodes: ['player', 'api', 'stream'],
          edges: ['player-api', 'api-stream'],
          events: 20,
          counted: 0,
          dbWrites: 0,
          labels: { player: '20 plays' },
        },
      ),
      step(
        'drop',
        'Nineteen are dropped',
        'The first event adds the viewer to the seen set. The next nineteen find them already there and are dropped. The count goes up by one, and nothing about the API had to know.',
        {
          nodes: ['stream', 'aggregator', 'redis'],
          edges: ['stream-aggregator', 'aggregator-redis'],
          events: 20,
          counted: 1,
          dbWrites: 0,
          labels: { redis: 'seen: drop 19', aggregator: 'v_42: +1' },
          tone: 'recovery',
        },
      ),
    ],
  },
  like: {
    id: 'like',
    label: 'Like twice',
    summary: 'A like is a row with a primary key, so a second like changes nothing.',
    steps: [
      step(
        'first',
        'The first like',
        'The viewer taps Like. The API inserts the pair (v_42, user 7) into the likes table. The row is new, so the API sends one "+1 like" event to the stream, and the aggregator adds it to the next batch like a view.',
        {
          nodes: ['player', 'api', 'db', 'stream'],
          edges: ['player-api', 'api-db', 'api-stream'],
          events: 1,
          counted: 1,
          dbWrites: 1,
          labels: { db: 'row inserted', api: 'new: send +1' },
        },
      ),
      step(
        'second',
        'The second like',
        'A double tap sends the like again. The insert hits the primary key and changes nothing, so the API sends no event. The like count cannot be inflated by tapping, retries or replays.',
        {
          nodes: ['player', 'api', 'db'],
          edges: ['player-api', 'api-db'],
          events: 1,
          counted: 1,
          dbWrites: 1,
          labels: { db: 'already there', api: 'no event' },
          tone: 'recovery',
        },
      ),
    ],
  },
  bot: {
    id: 'bot',
    label: 'A bot',
    summary: 'Crude bots are stopped at the door. Clever ones are counted at first and removed later.',
    steps: [
      step(
        'flood',
        'A thousand views a minute',
        'A script plays v_42 a thousand times a minute from one address, with a new fake device each time, so the seen set does not catch it.',
        {
          nodes: ['bot', 'api'],
          edges: ['bot-api'],
          events: 0,
          counted: 0,
          dbWrites: 0,
          labels: { bot: '1,000 / min' },
          tone: 'error',
        },
      ),
      step(
        'limit',
        'Rate limited',
        'The API allows only so many view events per account and per address. Everything above it gets a 429 and never reaches the stream. Most of the thousand die here.',
        {
          nodes: ['bot', 'api'],
          edges: ['bot-api'],
          events: 10,
          counted: 10,
          dbWrites: 0,
          labels: { api: '429 for 990' },
          tone: 'recovery',
        },
      ),
      step(
        'fraud',
        'Removed later',
        'Bots that spread over thousands of addresses slip through and are counted at first. A fraud job reads the same stream later, finds the pattern (no scrolling, identical watch times, data-center addresses) and subtracts those views. That is why a public count can go down.',
        {
          nodes: ['stream', 'aggregator', 'db'],
          edges: ['stream-aggregator', 'aggregator-db'],
          events: 10,
          counted: 0,
          dbWrites: 1,
          labels: { db: 'views − 10', aggregator: 'fraud: −10' },
          tone: 'recovery',
        },
      ),
    ],
  },
  crash: {
    id: 'crash',
    label: 'Aggregator crashes',
    summary: 'The aggregator dies with uncounted views in memory. None are lost and none are counted twice.',
    steps: [
      step(
        'collecting',
        'Halfway through a batch',
        'The aggregator has read 800 events since its last flush and holds the totals in memory.',
        {
          nodes: ['stream', 'aggregator'],
          edges: ['stream-aggregator'],
          events: 800,
          counted: 0,
          dbWrites: 0,
          labels: { aggregator: '800 in memory' },
        },
      ),
      step(
        'die',
        'It crashes',
        'The process dies. The 800 totals in memory are gone.',
        { nodes: ['aggregator'], edges: [], events: 800, counted: 0, dbWrites: 0, labels: { aggregator: 'down' }, tone: 'error' },
      ),
      step(
        'resume',
        'Start from the last flush',
        'The events are still in the stream. Every flush saved the stream position in the same transaction as the counts, so the new aggregator starts right after the last flush and reads the 800 events again. They were never added to the database, so they are counted exactly once.',
        {
          nodes: ['stream', 'aggregator', 'db'],
          edges: ['stream-aggregator', 'aggregator-db'],
          events: 800,
          counted: 800,
          dbWrites: 1,
          labels: { aggregator: 're-read 800', db: 'count + position' },
          tone: 'recovery',
        },
      ),
    ],
  },
};

export const COUNT_SCENARIO_ORDER: CountScenarioId[] = ['view', 'rewatch', 'like', 'bot', 'crash'];
