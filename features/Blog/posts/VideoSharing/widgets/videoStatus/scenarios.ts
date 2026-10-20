import type { FlowScenario, StepTone } from '@/features/Blog/flow/types';
import type {
  StatusEdgeId,
  StatusNodeId,
  StatusScenarioId,
  StatusStep,
} from './types';

const step = (
  id: string,
  title: string,
  detail: string,
  activeNodes: StatusNodeId[],
  activeEdges: StatusEdgeId[],
  labels?: Partial<Record<StatusNodeId, string>>,
  tone?: StepTone,
): StatusStep => ({ id, title, detail, activeNodes, activeEdges, labels, tone });

const UPLOADING = step(
  'uploading',
  'uploading',
  'The create request writes the row with status uploading. Chunks go straight to storage, and the creator sees progress. Viewers cannot see the video at all yet.',
  ['uploading'],
  [],
  { uploading: 'chunk 31 of 40' },
);

const TO_PROCESSING = step(
  'to-processing',
  'All chunks in: processing',
  'Storage holds every chunk, so the upload service assembles the file, queues one task per segment and resolution, and moves the status to processing. The video page now says "processing".',
  ['uploading', 'processing'],
  ['uploading-processing'],
  { processing: '18 tasks queued' },
);

export const STATUS_SCENARIOS: Record<StatusScenarioId, FlowScenario<StatusStep>> = {
  normal: {
    id: 'normal',
    label: 'Normal life',
    summary: 'Most videos take the straight line: uploading, processing, ready. Only the upload service ever changes the status.',
    steps: [
      UPLOADING,
      TO_PROCESSING,
      step(
        'to-ready',
        'Last task counted: ready',
        'The task that brings the count to 18 writes the manifests and moves the status to ready in the same transaction. Only then does video.ready go out, so nobody is told about a video that cannot play yet.',
        ['processing', 'ready'],
        ['processing-ready'],
        { ready: '18 of 18' },
        'recovery',
      ),
    ],
  },
  race: {
    id: 'race',
    label: 'Two triggers at once',
    summary: 'The client\'s finish hint and the sweep notice the same finished upload at the same moment.',
    steps: [
      UPLOADING,
      step(
        'both',
        'Two triggers fire',
        'The last chunk arrives. The client sends its finish hint, and in the same second the sweep picks the upload up, because the heartbeats had gone quiet. Both run the routine that starts processing. Done twice, it would queue every task twice.',
        ['uploading'],
        [],
        { uploading: 'hint + sweep' },
        'error',
      ),
      step(
        'cas',
        'Only one change wins',
        'Each one runs UPDATE videos SET status = \'processing\' WHERE id = 42 AND status = \'uploading\'. The database runs them one after the other. The first changes one row and queues the tasks. The second changes zero rows, because the status is no longer uploading, and stops there.',
        ['uploading', 'processing'],
        ['uploading-processing'],
        { uploading: 'hint: 1 row', processing: 'sweep: 0 rows' },
        'recovery',
      ),
      step(
        'rule',
        'The rule for every arrow',
        'Every arrow in this diagram is the same kind of conditional update: change the status only if it is still the one you expect. A late, repeated or duplicated trigger then does nothing, and the routine needs no lock and no coordinator.',
        ['uploading', 'processing', 'ready', 'removed', 'expired', 'failed'],
        [],
      ),
    ],
  },
  abandoned: {
    id: 'abandoned',
    label: 'Upload abandoned',
    summary: 'The creator closes the app at chunk 12 and never comes back.',
    steps: [
      step(
        'quiet',
        'The heartbeats stop',
        'The creator closes the app at chunk 12 of 40. The heartbeats stop, and last_activity stops moving.',
        ['uploading'],
        [],
        { uploading: '12 of 40, quiet' },
        'error',
      ),
      step(
        'check',
        'The sweep asks storage',
        'The sweep picks up uploads that went quiet and asks storage when the last chunk arrived. Nothing new for an hour, but the grace period is not over, so the creator can still resume and nothing changes.',
        ['uploading'],
        [],
        { uploading: 'grace period' },
      ),
      step(
        'expire',
        'Expired',
        'After the grace period the status moves to expired, and the upload is aborted in storage, which deletes the 12 chunks. The creator sees "upload not finished" and can start again.',
        ['uploading', 'expired'],
        ['uploading-expired'],
        { expired: '12 chunks freed' },
        'recovery',
      ),
    ],
  },
  failedRetry: {
    id: 'failedRetry',
    label: 'Fails, then retried',
    summary: 'A segment can never be encoded. The video fails cleanly, and a retry from the kept raw upload later succeeds.',
    steps: [
      TO_PROCESSING,
      step(
        'fail',
        'A task runs out of retries',
        'Segment 9 at 1080p fails four times and lands in the dead-letter queue. The status moves to failed with the reason, and every segment already encoded is deleted, so a video with a hole in it can never be published.',
        ['processing', 'failed'],
        ['processing-failed'],
        { failed: 'seg 9 1080p' },
        'error',
      ),
      step(
        'retry',
        'The creator taps Retry',
        'The raw upload is kept for a few days after a failure. Retry moves the status back to processing and queues all the tasks again, perhaps after a fix to the encoder. Nothing has to be uploaded again.',
        ['failed', 'processing'],
        ['failed-processing'],
        { processing: 'retry 1' },
        'recovery',
      ),
      step(
        'ready',
        'Ready after all',
        'This time every task succeeds and the video becomes ready. If the creator waits longer than the grace period, the raw upload is gone and the video stays failed for good.',
        ['processing', 'ready'],
        ['processing-ready'],
        { ready: '18 of 18' },
        'recovery',
      ),
    ],
  },
  removed: {
    id: 'removed',
    label: 'Deleted by its owner',
    summary: 'A ready video is deleted. The status changes first, and the copies around the system follow.',
    steps: [
      step(
        'delete',
        'The status changes first',
        'The owner deletes the video. The row moves to removed before anything else happens, so the API refuses new playback requests at once.',
        ['ready', 'removed'],
        ['ready-removed'],
        { removed: 'refused at once' },
      ),
      step(
        'copies',
        'The copies follow',
        'video.deleted goes out: the cache entry is deleted, the CDN purge runs in the background, and comments and counters are cleaned up by their own modules. A cached segment stops playing anyway, because its playback token expires within minutes and no fresh token is issued.',
        ['removed'],
        [],
        { removed: 'purge running' },
        'recovery',
      ),
    ],
  },
};

export const STATUS_SCENARIO_ORDER: StatusScenarioId[] = ['normal', 'race', 'abandoned', 'failedRetry', 'removed'];
