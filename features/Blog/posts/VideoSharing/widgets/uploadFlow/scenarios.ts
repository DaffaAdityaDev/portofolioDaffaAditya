import type { FlowScenario } from '@/features/Blog/flow/types';
import type { UploadScenarioId, UploadStep } from '@/features/Blog/posts/VideoSharing/widgets/uploadFlow/types';
import { UPLOAD_CHUNKS_TOTAL, UPLOAD_SEGMENTS_TOTAL } from './constants';

const CREATE: UploadStep = {
  id: 'create',
  title: 'Create the upload',
  detail:
    'The client makes an idempotency key the moment the user taps Upload, and sends it with the title, description and file size to the upload service. The service checks the user\'s upload quota, writes an upload record with the status "uploading" and an expiry time, and returns an uploadId plus signed URLs, one per chunk. The URLs are limited in size and lifetime, so a stray upload cannot waste unlimited space.',
  activeNodes: ['client', 'service', 'db'],
  activeEdges: ['client-service', 'service-db'],
  status: 'uploading',
  chunksReceived: 0,
  segmentsDone: 0,
  labels: { service: 'uploadId u_42' },
};

const chunks = (received: number, title: string, detail: string): UploadStep => ({
  id: `chunks-${received}`,
  title,
  detail,
  activeNodes: ['client', 'storage'],
  activeEdges: ['client-storage'],
  status: 'uploading',
  chunksReceived: received,
  segmentsDone: 0,
  labels: { client: `chunk ${received}/${UPLOAD_CHUNKS_TOTAL}` },
});

const CHUNKS_HALF = chunks(
  4,
  'Send chunks straight to storage',
  'The client cuts the file into 8 chunks and uploads them to video storage with the signed URLs. The video bytes never touch the upload service, so a huge upload costs it almost nothing.',
);

const CHUNKS_ALL = chunks(
  UPLOAD_CHUNKS_TOTAL,
  'The last chunk arrives',
  'Storage holds the whole raw video. It checked each chunk against its checksum as it landed.',
);

const SAY_DONE: UploadStep = {
  id: 'say-done',
  title: 'Tell the system it is done',
  detail:
    'The client sends one tiny request straight to the upload service: every chunk is sent. It is only a hint. The service does not take the client\'s word for it and checks storage itself. If the client never sends the hint, a storage event or the sweep reaches the same check later.',
  activeNodes: ['client', 'service'],
  activeEdges: ['client-service'],
  status: 'uploading',
  chunksReceived: UPLOAD_CHUNKS_TOTAL,
  segmentsDone: 0,
  labels: { service: 'finish request' },
};

const FINALIZE: UploadStep = {
  id: 'finalize',
  title: 'The upload service finishes the file',
  detail:
    'The upload service compares its record (8 chunks expected) with storage (8 held), assembles them with a control call and moves the video to "processing". Then it splits the work: it reads the length and keyframes of the video and queues one task per segment and resolution. It does not cut the file itself. The client hint, a storage event and the sweep all end in this same routine, and running it twice is harmless.',
  activeNodes: ['service', 'storage', 'db', 'broker'],
  activeEdges: ['service-storage', 'service-db', 'service-broker'],
  status: 'processing',
  chunksReceived: UPLOAD_CHUNKS_TOTAL,
  segmentsDone: 0,
  labels: { service: 'finalize + plan', broker: 'transcode tasks' },
};

const TRANSCODE: UploadStep = {
  id: 'transcode',
  title: 'Transcode in parallel',
  detail:
    'GPU transcoders take the tasks from the queue. Each one reads only its own time range of the raw video from storage, so the 6 segments are encoded in parallel on different machines.',
  activeNodes: ['broker', 'workers', 'storage'],
  activeEdges: ['broker-workers', 'storage-workers'],
  status: 'processing',
  chunksReceived: UPLOAD_CHUNKS_TOTAL,
  segmentsDone: 3,
  labels: { workers: 'segments 3/6' },
};

const RENDITIONS: UploadStep = {
  id: 'renditions',
  title: 'Write the renditions',
  detail:
    'Every segment is encoded as 1080p, 720p and 480p, and the results are written back to video storage.',
  activeNodes: ['workers', 'storage'],
  activeEdges: ['workers-storage'],
  status: 'processing',
  chunksReceived: UPLOAD_CHUNKS_TOTAL,
  segmentsDone: UPLOAD_SEGMENTS_TOTAL,
  labels: { workers: 'segments 6/6', storage: '3 renditions' },
};

const DONE: UploadStep = {
  id: 'done',
  title: 'Report back through the broker',
  detail:
    'Workers never write to the database. Each finished task publishes transcode.done. The upload service records it in one transaction: a row per task with a unique key, so a redelivered message changes nothing, and only for a new row an atomic increment of the video\'s counter. When the count reaches the total, it writes the manifests and only then sets the status to "ready" and announce video.ready for follow-ups such as a notification and cache invalidation.',
  activeNodes: ['workers', 'broker', 'service', 'db'],
  activeEdges: ['workers-broker', 'broker-service', 'service-db'],
  status: 'ready',
  chunksReceived: UPLOAD_CHUNKS_TOTAL,
  segmentsDone: UPLOAD_SEGMENTS_TOTAL,
  labels: { broker: 'transcode.done', service: 'all tasks in: ready' },
};

const PUBLISH: UploadStep = {
  id: 'publish',
  title: 'Viewers pull it through the CDN',
  detail:
    'The first viewers request the video. The CDN fetches it from storage once, then serves everyone after that from the edge.',
  activeNodes: ['storage', 'cdn'],
  activeEdges: ['storage-cdn'],
  status: 'ready',
  chunksReceived: UPLOAD_CHUNKS_TOTAL,
  segmentsDone: UPLOAD_SEGMENTS_TOTAL,
  labels: { cdn: 'warming up' },
};

const SEGMENT_FAILS: UploadStep = {
  id: 'segment-fails',
  title: 'One segment fails',
  detail:
    'Segment 5 hits a corrupt frame and its encoder crashes. The other five segments are fine.',
  activeNodes: ['workers'],
  activeEdges: [],
  status: 'processing',
  chunksReceived: UPLOAD_CHUNKS_TOTAL,
  segmentsDone: 4,
  tone: 'error',
  failedSegment: 4,
  labels: { workers: 'segment 5 failed' },
};

const retryFails = (attempt: number, delay: string): UploadStep => ({
  id: `retry-fails-${attempt}`,
  title: `Retry ${attempt} fails again`,
  detail: `The broker redelivers the task after ${delay}. Segment 5 crashes the same way, so the wait before the next attempt grows.`,
  activeNodes: ['broker', 'workers'],
  activeEdges: ['broker-workers'],
  status: 'processing',
  chunksReceived: UPLOAD_CHUNKS_TOTAL,
  segmentsDone: 4,
  tone: 'error',
  failedSegment: 4,
  labels: { workers: `retry ${attempt} failed`, broker: `redeliver in ${delay}` },
});

const upToProcessing: UploadStep[] = [CREATE, CHUNKS_ALL, SAY_DONE, FINALIZE, TRANSCODE];

export const UPLOAD_SCENARIOS: Record<UploadScenarioId, FlowScenario<UploadStep>> = {
  happy: {
    id: 'happy',
    label: 'Happy path',
    summary:
      'Nothing goes wrong. Notice that no video bytes touch the upload service, and every status change flows through it.',
    steps: [CREATE, CHUNKS_HALF, CHUNKS_ALL, SAY_DONE, FINALIZE, TRANSCODE, RENDITIONS, DONE, PUBLISH],
  },
  drop: {
    id: 'drop',
    label: 'Connection drops',
    summary: 'The network dies at chunk 6. Resumable uploads keep the chunks that already arrived.',
    steps: [
      CREATE,
      chunks(5, 'Send chunks', 'Chunks 1 to 5 reach video storage. Storage records each one as it arrives.'),
      {
        id: 'drop',
        title: 'The connection drops',
        detail:
          'The phone loses signal at chunk 6. Without resumable uploads the user would start again from zero. Here, storage keeps the 5 chunks it already has.',
        activeNodes: ['client'],
        activeEdges: [],
        status: 'uploading',
        chunksReceived: 5,
        segmentsDone: 0,
        tone: 'error',
        labels: { client: 'offline' },
      },
      {
        id: 'ask',
        title: 'Ask what is missing',
        detail:
          'When the connection returns, the client asks the upload service which chunks arrived. The service reads the list from storage (chunks 1 to 5) and returns it with fresh signed URLs for the rest, because the old ones may have expired while the phone was offline.',
        activeNodes: ['client', 'service', 'storage'],
        activeEdges: ['client-service', 'service-storage'],
        status: 'uploading',
        chunksReceived: 5,
        segmentsDone: 0,
        tone: 'recovery',
        labels: { storage: 'has chunks 1-5', service: 'parts + new URLs' },
      },
      {
        id: 'resume',
        title: 'Send only the rest',
        detail:
          'The client uploads chunks 6 to 8 and nothing else. The bad connection cost a few seconds, not the whole upload.',
        activeNodes: ['client', 'storage'],
        activeEdges: ['client-storage'],
        status: 'uploading',
        chunksReceived: UPLOAD_CHUNKS_TOTAL,
        segmentsDone: 0,
        tone: 'recovery',
        labels: { client: 'chunk 8/8' },
      },
      SAY_DONE,
      FINALIZE,
      TRANSCODE,
      RENDITIONS,
      DONE,
    ],
  },
  abandoned: {
    id: 'abandoned',
    label: 'User leaves',
    summary:
      'The user logs out or closes the app mid-upload and never comes back. The upload service notices and frees the space.',
    steps: [
      CREATE,
      chunks(5, 'Send chunks', 'Chunks 1 to 5 reach video storage. The client also sends a small heartbeat to the upload service. The service moves last_activity in the database only when the stored value is more than a few minutes old, so a long upload costs a handful of writes.'),
      {
        id: 'leave',
        title: 'The user logs out and closes the app',
        detail:
          'The upload stops at chunk 6. The signed URLs do not depend on the login session, so nothing breaks, but nobody is sending chunks any more. No heartbeat arrives any more, so last_activity in the database stops moving.',
        activeNodes: ['client'],
        activeEdges: [],
        status: 'uploading',
        chunksReceived: 5,
        segmentsDone: 0,
        tone: 'error',
        labels: { client: 'gone' },
      },
      {
        id: 'sweep',
        title: 'A sweep finds the stale upload',
        detail:
          'Every few minutes a sweep job in the upload service takes a batch of uploads whose last_activity is old, using an index, and publishes one check_upload message for each. A consumer asks storage which chunks exist (5 of 8) and when the last one arrived, instead of trusting the client. If the user returns within the grace period, they simply resume.',
        activeNodes: ['service', 'db', 'broker', 'storage'],
        activeEdges: ['service-db', 'service-broker', 'broker-service', 'service-storage'],
        status: 'uploading',
        chunksReceived: 5,
        segmentsDone: 0,
        tone: 'recovery',
        labels: { service: 'sweep job', storage: 'has 5/8' },
      },
      {
        id: 'expire',
        title: 'Expire the upload and free the space',
        detail:
          'After the grace period (say 24 hours) the upload service marks the upload "expired" and tells storage to abort it, which deletes the 5 stored chunks. A lifecycle rule in storage is the last safety net, in case the sweep itself ever fails.',
        activeNodes: ['service', 'db', 'storage'],
        activeEdges: ['service-db', 'service-storage'],
        status: 'expired',
        chunksReceived: 0,
        segmentsDone: 0,
        tone: 'recovery',
        labels: { service: 'abort upload', storage: 'chunks removed', db: 'expired' },
      },
    ],
  },
  doubleTap: {
    id: 'doubleTap',
    label: 'Double tap',
    summary: 'The create request is sent twice. The idempotency key keeps it to one video.',
    steps: [
      CREATE,
      {
        id: 'double-tap',
        title: 'The user taps Upload twice',
        detail:
          'Impatient taps, or an automatic retry after a timeout, send the create request a second time, possibly before the first answer has arrived. Without protection that would create two videos.',
        activeNodes: ['client', 'service'],
        activeEdges: ['client-service'],
        status: 'uploading',
        chunksReceived: 0,
        segmentsDone: 0,
        tone: 'error',
        labels: { service: '2nd request' },
      },
      {
        id: 'recognized',
        title: 'The upload service recognizes the key',
        detail:
          'The second request carries the same idempotency key, because the client made it before sending anything. A unique constraint on the key in the database rejects a duplicate, and the service returns the existing upload. There is still exactly one video.',
        activeNodes: ['service', 'db'],
        activeEdges: ['service-db'],
        status: 'uploading',
        chunksReceived: 0,
        segmentsDone: 0,
        tone: 'recovery',
        labels: { service: 'same key', db: '1 row, uploading' },
      },
      CHUNKS_ALL,
      SAY_DONE,
      FINALIZE,
      TRANSCODE,
      RENDITIONS,
      DONE,
    ],
  },
  retryWorks: {
    id: 'retryWorks',
    label: 'Segment fails, retry works',
    summary: 'One segment crashes. Only that segment is retried, and the video still becomes ready.',
    steps: [
      ...upToProcessing,
      SEGMENT_FAILS,
      {
        id: 'retry-ok',
        title: 'Retry only that segment',
        detail:
          'The task goes back to the broker, which redelivers it after a short delay. Only segment 5 is encoded again, and the finished segments are kept, so the retry costs one segment, not the whole video.',
        activeNodes: ['broker', 'workers'],
        activeEdges: ['broker-workers'],
        status: 'processing',
        chunksReceived: UPLOAD_CHUNKS_TOTAL,
        segmentsDone: UPLOAD_SEGMENTS_TOTAL,
        tone: 'recovery',
        labels: { workers: 'retry 1 ok', broker: 'redeliver in 5s' },
      },
      RENDITIONS,
      DONE,
    ],
  },
  givesUp: {
    id: 'givesUp',
    label: 'Segment keeps failing',
    summary: 'A segment can never be encoded. After three retries everything already encoded is deleted, and the creator is told.',
    steps: [
      ...upToProcessing,
      SEGMENT_FAILS,
      retryFails(1, '5s'),
      retryFails(2, '30s'),
      retryFails(3, '2m'),
      {
        id: 'dead-letter',
        title: 'Give up, delete the output, tell the creator',
        detail:
          'After three retries the broker moves the task to a dead-letter queue so it cannot block other videos. The upload service sets the status to "failed" with a reason and deletes every segment that was already encoded, because a video with a missing piece must never be published. That throws away finished work, but it is the right business rule. The raw upload is kept for a few days, so the creator can press Retry.',
        activeNodes: ['workers', 'broker', 'service', 'db', 'storage'],
        activeEdges: ['workers-broker', 'broker-service', 'service-db', 'service-storage'],
        status: 'failed',
        chunksReceived: UPLOAD_CHUNKS_TOTAL,
        segmentsDone: 0,
        tone: 'error',
        failedSegment: 4,
        labels: { broker: 'dead-letter', db: 'failed + reason', storage: 'outputs deleted' },
      },
    ],
  },
};

export const UPLOAD_SCENARIO_ORDER: UploadScenarioId[] = [
  'happy',
  'drop',
  'abandoned',
  'doubleTap',
  'retryWorks',
  'givesUp',
];
