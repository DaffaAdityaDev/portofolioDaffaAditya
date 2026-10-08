import type { BottleneckCopy, BottleneckKey } from '@/features/Blog/posts/VideoSharing/widgets/capacity/types';

export const BOTTLENECK_COPY: Record<BottleneckKey, BottleneckCopy> = {
  healthy: {
    title: 'Everything is holding',
    body: 'Every component has headroom at this traffic level.',
    fix: 'Press "Go viral" or drag the traffic slider. Then switch one design choice off to see what it was protecting.',
  },
  lb: {
    title: 'Load balancer saturated',
    body: 'The entry point cannot route this many requests per second, so everything behind it suffers.',
    fix: 'Run more load balancer nodes, or split traffic across regions with DNS.',
  },
  api: {
    title: 'API servers overloaded',
    body: 'Requests arrive faster than the servers can answer them, so playback starts fail or time out.',
    fix: 'Turn on autoscaling or raise the baseline server count.',
  },
  apiScaling: {
    title: 'API servers are still scaling up',
    body: 'Autoscaling reacts after the traffic arrives. Until new servers are ready, some requests fail.',
    fix: 'Raise the baseline server count so a spike starts with more headroom.',
  },
  cache: {
    title: 'Metadata cache saturated',
    body: 'The cache cannot answer lookups fast enough, so requests fall through to the database.',
    fix: 'Add cache nodes and spread hot keys across them.',
  },
  dbReads: {
    title: 'Every view becomes a database query',
    body: 'Without a cache, each playback start reads video metadata straight from the database.',
    fix: 'Turn on the metadata cache so repeat lookups never reach the database.',
  },
  dbReadsCached: {
    title: 'Cache misses overwhelm the database',
    body: 'The cache absorbs most reads, but the misses that remain are more than the database can serve.',
    fix: 'Add read replicas or shards.',
  },
  dbWrites: {
    title: 'Database cannot keep up with writes',
    body: 'Uploads and engagement updates all go through the primary. Read replicas do not help with writes.',
    fix: 'Add shards so writes spread across several machines.',
  },
  cdn: {
    title: 'CDN capacity exceeded',
    body: 'Viewers ask the edge for more bandwidth than the CDN can deliver, so videos buffer.',
    fix: 'Add a second CDN provider, or serve lower bitrates during the spike.',
  },
  blobOrigin: {
    title: 'Origin storage is overloaded',
    body: 'Too many requests miss the CDN and fall through to the storage cluster.',
    fix: 'Pre-warm the CDN for popular videos and add an origin shield layer.',
  },
  blobNoCdn: {
    title: 'Storage serves every viewer directly',
    body: 'Without a CDN, every byte of every stream comes from one storage cluster.',
    fix: 'Turn on the CDN so edge servers deliver most of the traffic.',
  },
  transcode: {
    title: 'Upload backlog is growing',
    body: 'Videos arrive faster than they can be transcoded, so creators wait before their video is playable.',
    fix: 'Add transcoding workers. The backlog drains once capacity beats the upload rate.',
  },
};
